import request from 'supertest';

describe('SessionsRouter', () => {
  const targetUrl = 'http://localhost:8080/sessions';
  let createdSessionId: string;

  beforeAll(async () => {
    // Kill the session if it is active
    await request(targetUrl).post('/stop');

    // Start a new session to use its ID in the tests
    const startResponse = await request(targetUrl).post('/start');
    createdSessionId = startResponse.body.id;
  });

  describe('GET /', () => {
    it('should return all mowing sessions', async () => {
      const response = await request(targetUrl).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /:id', () => {
    it('should return a specific mowing session by its ID', async () => {
      const response = await request(targetUrl).get(`/${createdSessionId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdSessionId);
      expect(response.body).toHaveProperty('startTime');
      expect(response.body).toHaveProperty('endTime');
    });

    it('should return 404 if the session ID is not found', async () => {
      const nonExistentSessionId = 'non_existent_id';
      const response = await request(targetUrl).get(`/${nonExistentSessionId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /start', () => {
    it('should start a new mowing session', async () => {
      // Stop the current session
      await request(targetUrl).post('/stop');

      const response = await request(targetUrl).post('/start');
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('startTime');
      expect(response.body).toHaveProperty('endTime', null);
    });
  });

  describe('POST /stop', () => {
    it('should stop an ongoing mowing session', async () => {
      // Start a session if none is active
      if (!createdSessionId) {
        const startResponse = await request(targetUrl).post('/start');
        createdSessionId = startResponse.body.id;
      }

      const response = await request(targetUrl).post('/stop');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('startTime');
      expect(response.body).toHaveProperty('endTime');
    });

    it('should return 404 if there is no ongoing session to stop', async () => {
      // Ensure there is no ongoing session
      await request(targetUrl).post('/stop');

      const response = await request(targetUrl).post('/stop');
      expect(response.status).toBe(404);
    });
  });
});
