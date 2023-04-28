import { PrismaClient, Coordinate } from '@prisma/client';
import { CoordinateRepository } from './src/data_access_layer/repositories/coordinate.repository';
import Chance from 'chance';
import { config } from 'dotenv';

config();

const chance = new Chance();
const prisma = new PrismaClient();
const coordinateRepository = new CoordinateRepository(prisma);

async function createSession() {
  const startTime = chance.date({ year: new Date().getFullYear() - 1 });
  const endTime = chance.date({ min: startTime as Date, max: new Date() });

  const newSession = await prisma.session.create({
    data: {
      startTime,
      endTime,
    },
  });

  return newSession;
}

function generatePath(numOfPoints: number) {
  const path = [];
  for (let i = 0; i < numOfPoints; i++) {
    const x = chance.integer({ min: 0, max: 1000 });
    const y = chance.integer({ min: 0, max: 1000 });
    path.push({ x, y });
  }
  return path;
}

async function createCoordinates(sessionId: string) {
  const numOfPoints = chance.integer({ min: 50, max: 150 });
  const path = generatePath(numOfPoints);

  for (let i = 0; i < path.length; i++) {
    const { x, y } = path[i];
    const timestamp = new Date(chance.date({ year: new Date().getFullYear() }));

    // Create Position coordinate
    const coordinate: Coordinate = {
      id: chance.hash({ length: 10 }), x: x, y: y, timestamp: timestamp, type: 'position',
      sessionId: ''
    }
    await coordinateRepository.addPosition(coordinate);


    // Simulate collision avoidance event by inserting Obstacle coordinate
    if (chance.integer({ min: 1, max: 100 }) <= 10) {
      const timestamp = new Date(chance.date({ year: new Date().getFullYear() }));
      const imagePath = `images/${chance.hash({ length: 10 })}`;
      const object = chance.word();
      const coordinateData = {x, y, timestamp, sessionId: ''};
      await coordinateRepository.addObstacle(
        coordinateData,
        imagePath,
        object,
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
      await coordinateRepository.addBoundary(
        {x: boundary.x, y: boundary.y, timestamp: timestamp, sessionId: ''},
      );
    }
  }
}

async function main() {
  const numOfSessions = 10;

  for (let j = 0; j < numOfSessions; j++) {
    const session = await createSession();
    await createCoordinates(session.id);
  }
}

main();
