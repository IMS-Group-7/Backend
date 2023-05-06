import request from 'supertest';
import FormData from 'form-data';
import { randomInt } from 'crypto';
const targetUrl = 'http://localhost:8080';
const { PrismaClient } = require('@prisma/client')
const fs = require('fs');
const path = require('path');

describe('CoordinatesRouter', () => {
    let sessionId: string;
    const prisma = new PrismaClient()

    beforeAll(async () => {
      await prisma.obstacle.deleteMany();
      await prisma.coordinate.deleteMany();
      await prisma.session.deleteMany();

      // Add a session for testing purposes
      const stopIfExists = await request(targetUrl).post('/sessions/stop').send(
        {
          endTime: new Date(),
        });

      const ok = await request(targetUrl).post('/sessions/start').send({
        startTime: new Date(),
      });
      sessionId = ok.body.id;
    });
  
    afterAll(async () => {
      await prisma.$disconnect();
    });
  

  beforeEach(async () => {
    // Clean up and set up the necessary data for testing.
  });
  describe('POST /positions', () => {
    test('should create a new position coordinate', async () => {
      const requestBody = {
        x: 10,
        y: 20,
      };
      const response = await request(targetUrl).post('/coordinates/positions').send(requestBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionId', sessionId);
      expect(response.body).toHaveProperty('x', requestBody.x);
      expect(response.body).toHaveProperty('y', requestBody.y);

      await prisma.coordinate.deleteMany();
    });

    test('should return a 400 status code for invalid input', async () => {
      const requestBody = {
        sessionId,
        x: 'invalid',
        y: 20,
      };
      const response = await request(targetUrl).post('/coordinates/positions').send(requestBody);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /boundaries', () => {
    let requestBody: any;
  
    beforeEach(() => {
      requestBody = {
        x: 0,
        y: 0,
      };
    });
  
    test('should create a new boundary', async () => {
      const response = await request(targetUrl).post('/coordinates/boundaries').send(requestBody);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionId', sessionId);
      expect(response.body).toHaveProperty('x', requestBody.x);
      expect(response.body).toHaveProperty('y', requestBody.y);
    });
  
    test('should return a 400 status code for invalid input', async () => {
      requestBody.x = 'invalid';
      const response = await request(targetUrl).post('/coordinates/boundaries').send(requestBody);
  
      expect(response.status).toBe(400);
    });
});

describe('GET /active-session-path', () => {
    test('should return the path of the active session', async () => {
    // Create some coordinates for the active session
    const coordinates = [
    { x: 0, y: 0 },
    { x: 10, y: 20 },
    { x: 30, y: 40 },
    ];
    for (const coordinate of coordinates) {
        await request(targetUrl).post('/coordinates/positions').send({
          x: coordinate.x,
          y: coordinate.y,
          timestamp: new Date(),
          type: 'POSITION',
        });
      }
      
      const response = await request(targetUrl).get('/coordinates/active-session-path');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((obj: any, i: number) => {
            expect(obj).toBeInstanceOf(Object);
            expect(obj).toHaveProperty('x', coordinates[i].x);
            expect(obj).toHaveProperty('y', coordinates[i].y);
      });
    });

    test('should return an empty path if there is no active session', async () => {
    // Remove the active session
      prisma.session.deleteMany();
      const response = await request(targetUrl).get('/coordinates/active-session-path');

      expect(response.status).toBe(200);
    });

  });

  describe('POST /obstacles', () => {
    test('should create a new obstacle', async () => {
  
      // Read the doggo.jpg image from the test_images folder
      const imagePath = path.join(__dirname, 'test_images', 'dog.jpg');
      const imageData = fs.readFileSync(imagePath);
  
      // Convert the image data to a base64 encoded string
      const base64ImageData = `data:image/jpeg;base64,${imageData.toString('base64')}`;
  
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('x', '50');
      formData.append('y', '50');
      formData.append('image', Buffer.from(base64ImageData.split(',')[1], 'base64'), { filename: 'doggo.jpg' });
  
      const req = request(targetUrl)
        .post('/coordinates/obstacles')
        .set('Content-Type', formData.getHeaders()['content-type'])
        .send(formData.getBuffer());
  
      const response = await req;
  
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('object', 'Dog');
    });
  
    test('should return a 400 status code for invalid input', async () => {
      const requestBody = {
        sessionId,
        x: 'invalid',
        y: 20,
        image: Buffer.from('example-image-data').toString('base64'),
      };
      const response = await request(targetUrl).post('/coordinates/obstacles').send(requestBody);
  
      expect(response.status).toBe(400);
    });
  
  });
  
  describe('GET /obstacles/:obstacleId', () => {
    test('should return the obstacle data for the given obstacleId', async () => {
      const session = await request(targetUrl).get(`/sessions/${sessionId}`);
      expect(session.status).toBe(200);
      expect(session.body).toHaveProperty('coordinate', expect.any(Array))
      const length = session.body.coordinate.length;
      expect(session.body.coordinate.length).toBeGreaterThan(0);
      const randomCoordinate = session.body.coordinate [randomInt(0,length)]
      const obstacle = randomCoordinate.obstacle;
      const response = await request(targetUrl).get(`/coordinates/obstacles/${obstacle.id}`);

      expect(response.status).toBe(200);
      const retrievedObstacle = response.body;
      expect(retrievedObstacle).toBeInstanceOf(Object);
      
      expect(obstacle).toHaveProperty('id', retrievedObstacle.id);
      expect(obstacle).toHaveProperty('coordinateId', randomCoordinate.id);
      expect(obstacle).toHaveProperty('object', retrievedObstacle.object);
    });
  
    test('should return 404 if the obstacle is not found', async () => {
      const nonExistentObstacleId = 'non-existent-obstacle-id';
      const response = await request(targetUrl).get(`/coordinates/obstacles/${nonExistentObstacleId}`);
      expect(response.status).toBe(404);
    });
  });
  });