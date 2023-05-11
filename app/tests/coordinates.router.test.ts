import request from 'supertest';
import { randomInt } from 'crypto';
import path from 'path';
const SERVER_URL = 'Mower-Backend:8080';

describe('CoordinatesRouter', () => {
    const SESSIONS_URL = `${SERVER_URL}/sessions`;
    const COORDINATES_URL = `${SERVER_URL}/coordinates`;

  describe('POST /positions', () => {
    beforeAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });
  
      afterAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });

    it('should create a new position coordinate', async () => {
      const requestBody = {
        x: 10,
        y: 20,
      };
      const session = await request(SESSIONS_URL).post('/start').send();
      const sessionId = session.body.id;
      const response = await request(COORDINATES_URL).post('/positions').send(requestBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionId', sessionId);
      expect(response.body).toHaveProperty('x', requestBody.x);
      expect(response.body).toHaveProperty('y', requestBody.y);

    });

    it('should return a 400 status code for invalid input', async () => {
      const requestBody = {
        x: 'invalid',
        y: 20,
      };
      const response = await request(COORDINATES_URL).post('/positions').send(requestBody);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /boundaries', () => {
    beforeAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });
  
      afterAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });
    let requestBody: any;
  
    beforeEach(() => {
      requestBody = {
        x: 0,
        y: 0,
      };
    });
    
    it('should create a new boundary', async () => {
      const session = await request(SESSIONS_URL).post('/start').send();
      const sessionId = session.body.id;
      const response = await request(COORDINATES_URL).post('/boundaries').send(requestBody);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sessionId', sessionId);
      expect(response.body).toHaveProperty('x', requestBody.x);
      expect(response.body).toHaveProperty('y', requestBody.y);
    });
  
    it('should return a 400 status code for invalid input', async () => {
      requestBody.x = 'invalid';
      const response = await request(COORDINATES_URL).post('/boundaries').send(requestBody);
  
      expect(response.status).toBe(400);
    });
});

describe('GET /active-session-path', () => {
    beforeAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });
  
      afterAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });
    it('should return the path of the active session', async () => {
        const session = await request(SESSIONS_URL).post('/start');
        const sessionId = session.body.id;

    // Create some coordinates for the active session
    const coordinates = [
    { x: 0, y: 0 },
    { x: 10, y: 20 },
    { x: 30, y: 40 },
    ];
    for (const coordinate of coordinates) {
        await request(COORDINATES_URL).post('/positions').send({
          x: coordinate.x,
          y: coordinate.y,
          timestamp: new Date(),
          type: 'POSITION',
        });
      }
      
      const response = await request(COORDINATES_URL).get('/active-session-path');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((obj: any, i: number) => {
            expect(obj).toBeInstanceOf(Object);
            expect(obj).toHaveProperty('x', coordinates[i].x);
            expect(obj).toHaveProperty('y', coordinates[i].y);
      });
    });

    it('should return an empty path if there is no active session', async () => {
    // Remove the active session
      const response = await request(COORDINATES_URL).get('/active-session-path');

      expect(response.status).toBe(200);
    });

  });

  describe('POST /obstacles', () => {
    beforeAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
    });

    afterAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
    });

    it('should create a new obstacle', async () => {
        const session = await request(SESSIONS_URL).post('/start').send();
        const sessionId = session.body.id;

        // Read the doggo.jpg image from the test_images folder
        const imagePath = path.join(__dirname, 'assets', 'dog.jpg');

        const response = await request(COORDINATES_URL)
            .post('/obstacles')
            .field('sessionId', sessionId)
            .field('x', '50')
            .field('y', '50')
            .attach('image', imagePath);

        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('object', 'Dog');
    });

    it('should return a 400 status code for invalid input', async () => {
        const requestBody = {
            x: 'invalid',
            y: 20,
            image: Buffer.from('example-image-data').toString('base64'),
        };
        const response = await request(COORDINATES_URL).post('/obstacles').send(requestBody);

        expect(response.status).toBe(400);
    });
});

  
  describe('GET /obstacles/:obstacleId', () => {
    beforeAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });
  
      afterAll(async () => {
        await request(SESSIONS_URL).post('/stop').send();
      });
    it('should return the obstacle data for the given obstacleId', async () => {
      const createdSession = await request(SESSIONS_URL).post('/start').send();
      const sessionId = createdSession.body.id;
      const session = await request(SESSIONS_URL).get(`/${sessionId}`);
      expect(session.status).toBe(200);
      expect(session.body).toHaveProperty('coordinate', expect.any(Array))
      const length = session.body.coordinate.length;
      expect(session.body.coordinate.length).toBeGreaterThanOrEqual(0);
      if (length != 0) {
        const randomCoordinate = session.body.coordinate [randomInt(0,length)]
        const obstacle = randomCoordinate.obstacle;
        const response = await request(COORDINATES_URL).get(`/obstacles/${obstacle.id}`);

        expect(response.status).toBe(200);
        const retrievedObstacle = response.body;
        expect(retrievedObstacle).toBeInstanceOf(Object);
        
        expect(obstacle).toHaveProperty('id', retrievedObstacle.id);
        expect(obstacle).toHaveProperty('coordinateId', randomCoordinate.id);
        expect(obstacle).toHaveProperty('object', retrievedObstacle.object);
      } else {
        console.log("Empty coordinate array, skipping tests");
      }
    });
  
    it('should return 404 if the obstacle is not found', async () => {
      const nonExistentObstacleId = 'non-existent-obstacle-id';
      const response = await request(COORDINATES_URL).get(`/obstacles/${nonExistentObstacleId}`);
      expect(response.status).toBe(404);
    });
  });
  });