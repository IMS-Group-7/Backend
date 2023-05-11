import request from 'supertest';
import { randomInt } from 'crypto';
import path from 'path';

const SERVER_URL = 'Mower-Backend:8080';

describe('Coordinates Router', () => {
  const SESSIONS_URL = `${SERVER_URL}/sessions`;
  const COORDINATES_URL = `${SERVER_URL}/coordinates`;

  describe('POST /positions', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    it('Should create a new position coordinate', async () => {
      await request(SESSIONS_URL).post('/start');

      const response = await request(COORDINATES_URL)
        .post('/positions')
        .send({ x: 10, y: 20 });

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('Should return a 400 status code for invalid input', async () => {
      const response = await request(COORDINATES_URL)
        .post('/positions')
        .send({ x: 'invalid', y: 20 });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('Should return a 400 status code for invalid input', async () => {
      const response = await request(COORDINATES_URL).post('/positions').send({
        x: 20,
        y: 'invalid',
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('Should return a 400 error, indicating no active session was found', async () => {
      await request(SESSIONS_URL).post('/stop');

      const response = await request(COORDINATES_URL).post('/positions').send({
        x: 10,
        y: 20,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('POST /boundaries', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    it('Should create a new boundary coordinate', async () => {
      await request(SESSIONS_URL).post('/start');

      const response = await request(COORDINATES_URL).post('/boundaries').send({
        x: 10,
        y: 10,
      });

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('Should return a 400 status code for invalid input', async () => {
      const response = await request(COORDINATES_URL).post('/boundaries').send({
        x: 'Test',
        y: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('Should return a 400 error, indicating no active session was found', async () => {
      await request(SESSIONS_URL).post('/stop');

      const response = await request(COORDINATES_URL).post('/boundaries').send({
        x: 10,
        y: 10,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('GET /active-session-path', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    it('Should return the path of the active session', async () => {
      await request(SESSIONS_URL).post('/start');

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
        });
      }

      const response = await request(COORDINATES_URL).get(
        '/active-session-path',
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((obj: any, i: number) => {
        expect(obj).toBeInstanceOf(Object);
        expect(obj).toHaveProperty('x', coordinates[i].x);
        expect(obj).toHaveProperty('y', coordinates[i].y);
      });
    });

    it('Should return a 404 error, indicating there is no active session', async () => {
      await request(SESSIONS_URL).post('/stop');

      const response = await request(COORDINATES_URL).get(
        '/active-session-path',
      );

      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('POST /obstacles', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    const imagePath = path.join(__dirname, 'assets', 'dog.jpg');

    it('Should create a new obstacle', async () => {
      await request(SESSIONS_URL).post('/start');

      const response = await request(COORDINATES_URL)
        .post('/obstacles')
        .field('x', 50)
        .field('y', 50)
        .attach('image', imagePath);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('object', 'Dog');
    });

    it('Should return a 400 error for invalid input', async () => {
      const response = await request(COORDINATES_URL)
        .post('/obstacles')
        .field('x', 'invalid')
        .field('y', 20)
        .attach('image', imagePath);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('Should return a 400 error, indicating no active session was found', async () => {
      await request(SESSIONS_URL).post('/stop');

      const response = await request(COORDINATES_URL)
        .post('/obstacles')
        .field('x', 50)
        .field('y', 50)
        .attach('image', imagePath);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('GET /obstacles/:obstacleId', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });
    it('should return the obstacle data for the given obstacleId', async () => {

      const createdSession = await request(SESSIONS_URL).post('/start');
      const sessionId = createdSession.body.id;
      const session = await request(SESSIONS_URL).get(`/${sessionId}`);

      expect(session.status).toBe(200);
      const sessionBody = session.body;
      expect(sessionBody).toHaveProperty('coordinate', expect.any(Array));

      const coordinateArrayLength = sessionBody.coordinate.length;
      expect(coordinateArrayLength).toBeGreaterThanOrEqual(0);
      const sessionHasCoordinates = coordinateArrayLength > 0;

      if (sessionHasCoordinates) {
        // Get a randomly selected coordinate object from the current session that was retrieved earlier
        const randomCoordinateIx = sessionBody.coordinate[randomInt(0, coordinateArrayLength)];
        const randomCoordinate = sessionBody.coordinate[randomCoordinateIx];
        // Extract the obstacle object from the randomly selected coordinate
        const extractedObstacle = randomCoordinate.obstacle;
        // Get this specific obstacle's information from the API
        const detailedObstacleResponse = await request(COORDINATES_URL).get(
          `/obstacles/${extractedObstacle.id}`,
        );

        // The obstacle exists
        expect(detailedObstacleResponse.status).toBe(200);
        const detailedObstacleInformation = detailedObstacleResponse.body;

        expect(extractedObstacle).toBeInstanceOf(Object);
        expect(extractedObstacle).toHaveProperty('id', detailedObstacleInformation.id);
        // The obstacle contains a value called coordinateId, so it should match the randomly selected coordinate's id that was retrieved earlier
        expect(extractedObstacle).toHaveProperty('coordinateId', randomCoordinate.id);
        // The obstacle of the randomly selected coordinate should match the retrieved obstacles object type
        expect(extractedObstacle).toHaveProperty('object', detailedObstacleInformation.object);
      }
    });

    it('should return 404 if the obstacle is not found', async () => {
      const nonExistentObstacleId = 'non-existent-obstacle-id';
      const response = await request(COORDINATES_URL).get(
        `/obstacles/${nonExistentObstacleId}`,
      );
      expect(response.status).toBe(404);
    });
  });
});
