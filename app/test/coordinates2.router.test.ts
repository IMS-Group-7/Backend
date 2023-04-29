import request from 'supertest';
import Server from '../src/server';
import { dependencies } from '../src/dependencies';
import FormData from 'form-data';

describe('CoordinatesRouter', () => {
    let server: Server;
    let app: Express.Application;
    let sessionId: string;
    const prisma = dependencies.databaseClient;

    beforeAll(async () => {
      server = new Server(8081, dependencies);
      app = server.expressApp;
      await server.listen();
      await prisma.coordinate.deleteMany();
      await prisma.session.deleteMany();
      await prisma.obstacle.deleteMany();

      // Add a session for testing purposes
      const stopIfExists = await request(app).post('/sessions/stop').send(
        {
          endTime: new Date(),
        });

      const ok = await request(app).post('/sessions/start').send({
        startTime: new Date(),
      });
      sessionId = ok.body.id;
    });
  
    afterAll(async () => {
      await server.close();
    });
  

  beforeEach(async () => {
    // Clean up and set up the necessary data for testing.
  });
  describe('POST /positions', () => {
    test('should create a new position coordinate', async () => {
      const requestBody = {
        sessionId: sessionId,
        x: 10,
        y: 20,
      };
      const response = await request(app).post('/coordinates/positions').send(requestBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionId', requestBody.sessionId);
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
      const response = await request(app).post('/coordinates/positions').send(requestBody);

      expect(response.status).toBe(400);
    });
    // Add more test cases for different scenarios.
  });

  describe('POST /boundaries', () => {
    let requestBody: any;
  
    beforeEach(() => {
      requestBody = {
        sessionId,
        x: 0,
        y: 0,
      };
    });
  
    test('should create a new boundary', async () => {
      const response = await request(app).post('/coordinates/boundaries').send(requestBody);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionId', requestBody.sessionId);
      expect(response.body).toHaveProperty('x', requestBody.x);
      expect(response.body).toHaveProperty('y', requestBody.y);
    });
  
    test('should return a 400 status code for invalid input', async () => {
      requestBody.x = 'invalid';
      const response = await request(app).post('/coordinates/boundaries').send(requestBody);
  
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
        await request(app).post('/coordinates/positions').send({
          sessionId,
          x: coordinate.x,
          y: coordinate.y,
          timestamp: new Date(),
          type: 'POSITION',
        });
      }
      
      const response = await request(app).get('/coordinates/active-session-path');
      
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
      const response = await request(app).get('/coordinates/active-session-path');

      expect(response.status).toBe(200);
    });

    // Add more test cases for different scenarios.
  });

  describe('POST /obstacles', () => {
    test('should create a new obstacle', async () => {
      const sessionId = 'clh28u11i0000vh0sqflucutm';
    
      const base64ImageData = 'data:image/jpeg;base64,/9j/4AAQSk...'; // Replace with base64 encoded test image data
      const imageData = Buffer.from(base64ImageData.split(',')[1], 'base64');
    
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('x', '50');
      formData.append('y', '50');
      formData.append('image', imageData, { filename: 'image.jpg' });
    
      const req = request(app)
        .post('/coordinates/obstacles')
        .set('Content-Type', formData.getHeaders()['content-type']) // Set the correct Content-Type header
        .send(formData.getBuffer()); // Get the proper buffer using getBuffer()
    
      const response = await req;
      console.log("R:BODY ", response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionId', sessionId);
      expect(response.body).toHaveProperty('x', 50);
      expect(response.body).toHaveProperty('y', 50);
    });
    
    test('should return a 400 status code for invalid input', async () => {
      const requestBody = {
        sessionId,
        x: 'invalid',
        y: 20,
        image: Buffer.from('example-image-data').toString('base64'),
      };
      const response = await request(app).post('/coordinates/obstacles').send(requestBody);
  
      expect(response.status).toBe(400);
    });
  
    // Add more test cases for different scenarios.
  });
  
  describe('GET /obstacles/:obstacleId', () => {
    test('should return the obstacle data for the given obstacleId', async () => {
      const requestBody = {
        sessionId,
        x: 100,
        y: 100,
        image: Buffer.from('example-image-data').toString('base64'),
      };
      const createdObstacleResponse = await request(app).post('/coordinates/obstacles').send(requestBody);
      const createdObstacle = createdObstacleResponse.body;
  
      const response = await request(app).get(`/coordinates/obstacles/${createdObstacle.id}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdObstacle.id);
      expect(response.body).toHaveProperty('sessionId', createdObstacle.sessionId);
      expect(response.body).toHaveProperty('x', createdObstacle.x);
      expect(response.body).toHaveProperty('y', createdObstacle.y);
    });
  
    test('should return 404 if the obstacle is not found', async () => {
      const nonExistentObstacleId = 'non-existent-obstacle-id';
      const response = await request(app).get(`/coordinates/obstacles/${nonExistentObstacleId}`);
  
      expect(response.status).toBe(404);
    });
  });
    // Add more test cases for different scenarios.
  });