import { PrismaClient } from '@prisma/client';
import  * as faker  from 'faker';
import { CoordinateRepository } from './src/data_access_layer/repositories/coordinate.repository';

const prisma = new PrismaClient();
const coordinateRepository = new CoordinateRepository(prisma);

async function createMower() {
  const newMower = await prisma.mower.create({
    data: {
      serial: faker.random.alphaNumeric(10),
      status: faker.random.arrayElement(['idle', 'active', 'offline']),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });

  return newMower;
}

async function createSession(mowerId: string) {
  const startTime = faker.date.past();
  const endTime = faker.date.between(startTime, new Date());

  const newSession = await prisma.session.create({
    data: {
      mowerId,
      startTime,
      endTime,
    },
  });

  return newSession;
}

function generatePath(numOfPoints: number) {
  const path = [];
  for (let i = 0; i < numOfPoints; i++) {
    const x = faker.random.number({ min: 0, max: 1000 });
    const y = faker.random.number({ min: 0, max: 1000 });
    path.push({ x, y });
  }
  return path;
}

async function createCoordinates(sessionId: string) {
  const numOfPoints = faker.random.number({ min: 50, max: 150 });
  const path = generatePath(numOfPoints);

  for (let i = 0; i < path.length; i++) {
    const { x, y } = path[i];
    const timestamp = faker.date.recent();

    // Create Position coordinate
    await coordinateRepository.createPosition(sessionId, x, y, timestamp);

    // Simulate collision avoidance event by inserting Obstacle coordinate
    if (faker.random.number({ min: 1, max: 100 }) <= 10) {
      const imagePath = `images/${faker.system.fileName()}`;
      const object = faker.random.word();
      await coordinateRepository.createObstacle(
        sessionId,
        x,
        y,
        timestamp,
        imagePath,
        object
      );
    }

    // Create Boundary coordinates around the path
    const boundaryOffset = 5;
    const boundaryCoordinates = [
      { x: x - boundaryOffset, y: y - boundaryOffset },
      { x: x - boundaryOffset, y: y + boundaryOffset },
      { x: x + boundaryOffset, y: y - boundaryOffset },
      { x: x + boundaryOffset, y: y + boundaryOffset },
    ];

    for (const boundary of boundaryCoordinates) {
      await coordinateRepository.createBoundary(
        sessionId,
        boundary.x,
        boundary.y,
        timestamp
      );
    }
  }
}

async function main() {
  const numOfMowers = 10;
  const numOfSessionsPerMower = 5;

  for (let i = 0; i < numOfMowers; i++) {
    const mower = await createMower();

    for (let j = 0; j < numOfSessionsPerMower; j++) {
      const session = await createSession(mower.id);
      await createCoordinates(session.id);
    }
  }
}