import request from 'supertest';
import { PrismaClient } from '@prisma/client';
const targetUrl = 'http://localhost:8080';

describe('SessionsRouter', () => {
  const prisma = new PrismaClient();
  let sessionId: string;

  beforeAll(async () => {
    await prisma.obstacle.deleteMany();
    await prisma.coordinate.deleteMany();
    await prisma.session.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /sessions/start', () => {
    test('should start a new session', async () => {
      const response = await request(targetUrl).post('/sessions/start').send();

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('startTime');
      expect(response.body).toHaveProperty('endTime', null);

      sessionId = response.body.id;
    });

    test('should return a 400 status code if a session is already active', async () => {
      const response = await request(targetUrl).post('/sessions/start').send();

      expect(response.status).toBe(400);
    });
  });

  describe('POST /sessions/stop', () => {
    test('should stop the active session', async () => {
      const response = await request(targetUrl).post('/sessions/stop').send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', sessionId);
      expect(response.body).toHaveProperty('endTime');
    });

    test('should return a 404 status code if there is no active session', async () => {
      const response = await request(targetUrl).post('/sessions/stop').send();

      expect(response.status).toBe(404);
    });
  });

  describe('GET /sessions', () => {
    test('should retrieve all mowing sessions', async () => {
      const response = await request(targetUrl).get('/sessions');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /sessions/:id', () => {
    test('should get a specific mowing session by its ID', async () => {
      const response = await request(targetUrl).get(`/sessions/${sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', sessionId);
      expect(response.body).toHaveProperty('coordinate', expect.any(Array));
    });

    test('should return a 404 status code if the session is not found', async () => {
      const nonExistentSessionId = 'non-existent-session-id';
      const response = await request(targetUrl).get(`/sessions/${nonExistentSessionId}`);

      expect(response.status).toBe(404);
    });
  });
});