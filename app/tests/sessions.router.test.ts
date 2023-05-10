import request from 'supertest';

const SERVER_URL = 'Mower-Backend:8080';

describe('Sessions Router', () => {
  const SESSIONS_URL = `${SERVER_URL}/sessions`;

  describe('GET /sessions', () => {
    it('Should fetch all mowing sessions', async () => {
      const res = await request(SESSIONS_URL).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /sessions/:id', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    it('Should fetch a mowing session by ID', async () => {
      // Create a new session to get its ID
      const newSessionRes = await request(SESSIONS_URL).post('/start');
      const sessionId = newSessionRes.body.id;

      // Get session by ID
      const res = await request(SESSIONS_URL).get(`/${sessionId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(sessionId);
    });

    it('Should return 404 error, indicating the mowing session is not found', async () => {
      const sessionId = 'abc123';

      const res = await request(SESSIONS_URL).get(`/${sessionId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /sessions/start', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    it('Should start a new mowing session', async () => {
      const res = await request(SESSIONS_URL).post('/start');

      expect(res.status).toBe(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('startTime');
      expect(res.body).toHaveProperty('endTime', null);
    });

    it('Should return a 400 error, indicating a mowing session is already active', async () => {
      const res = await request(SESSIONS_URL).post('/start');

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('POST /sessions/stop', () => {
    beforeAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    afterAll(async () => {
      await request(SESSIONS_URL).post('/stop');
    });

    it('Should stop an active mowing session', async () => {
      await request(SESSIONS_URL).post('/start');

      const res = await request(SESSIONS_URL).post('/stop');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('startTime');
      expect(res.body).toHaveProperty('endTime');
      expect(res.body.endTime).not.toBeNull();
    });

    it('Should return a 404 error, indicating no active was session found', async () => {
      const res = await request(SESSIONS_URL).post('/stop');

      expect(res.status).toBe(404);
      expect(res.body).toBeInstanceOf(Object);
    });
  });
});
