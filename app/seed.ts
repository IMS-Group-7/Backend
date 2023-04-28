import { PrismaClient, Coordinate } from '@prisma/client';
import { CoordinateRepository } from './src/data_access_layer/repositories/coordinate.repository';
import Chance from 'chance';
import { config } from 'dotenv';
import fs from 'fs';

config();

const chance = new Chance();
const prisma = new PrismaClient();
const coordinateRepository = new CoordinateRepository(prisma);

const gridSize = 20;
const boundaryOffset = 1;

const grid: string[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(' '));

function drawOnGrid(x: number, y: number, symbol: string) {
  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
    grid[y][x] = symbol;
  }
}

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

function generatePath() {
  const path = [];
  let y = chance.integer({ min: boundaryOffset, max: gridSize - boundaryOffset - 1 });
  let x = boundaryOffset;

  while (x < gridSize - boundaryOffset) {
    const direction = chance.integer({ min: 0, max: 1 });

    switch (direction) {
      case 0: // Move up
        if (y > boundaryOffset) {
          y = y - 1;
        }
        break;
      case 1: // Move down
        if (y < gridSize - boundaryOffset - 1) {
          y = y + 1;
        }
        break;
    }

    path.push({ x, y });
    x = x + 1;
  }

  return path;
}

function drawBoundaries() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (
        i < boundaryOffset ||
        j < boundaryOffset ||
        i >= gridSize - boundaryOffset ||
        j >= gridSize - boundaryOffset
      ) {
        drawOnGrid(j, i, "B");
      }
    }
  }
}

drawBoundaries();

async function createCoordinates(sessionId: string, x: number, y: number) {
  const timestamp = new Date(chance.date({ year: new Date().getFullYear() }));

  // Create Position coordinate
  const coordinate: Coordinate = {
    id: chance.hash({ length: 10 }),
    x: x,
    y: y,
    timestamp: timestamp,
    type: 'position',
    sessionId,
  };
  await coordinateRepository.addPosition(coordinate);

  drawOnGrid(x, y, 'm');

  // Simulate collision avoidance event by inserting Obstacle coordinate
  if (chance.integer({ min: 1, max: 100 }) <= 10) {
    const timestamp = new Date(chance.date({ year: new Date().getFullYear() }));
    const imagePath = `images/${chance.hash({ length: 10 })}`;
    const object = chance.word();
    const coordinateData = { x, y, timestamp, sessionId };
    await coordinateRepository.addObstacle(coordinateData, imagePath, object);

    drawOnGrid(x, y, 'X');
  }
}

function saveGridToFile(filename: string) {
  const output = grid.map((row) => row.join('')).join('\n');
  fs.writeFileSync(filename, output);
  }
  
  async function main() {
  const numOfSessions = 10;
  
  for (let j = 0; j < numOfSessions; j++) {
  const session = await createSession();
  const path = generatePath();
  for (const point of path) {
    await createCoordinates(session.id, point.x, point.y);
  }
  
  saveGridToFile(`session_${session.id}_map_visualization.txt`);
}
}

main();