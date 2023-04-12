import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';
import { MowerService } from '../../../business_logic_layer/services';
import { CollisionService } from '../../../business_logic_layer/services/collision.service';

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })



export class CollisionsRouter extends AbstractRouter {
  constructor(private collisionService: CollisionService) {
    super('/collisions');
  }

  protected async initRoutes(): Promise<void> {

    /**
     * Fetch one collision avoidance event by id
     */
    this.router.get('/obstacles/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      res.status(200).json({
        sessionId: "1DcaxzcsxSD", x: 1, y: 1, object: "a plant", imagePath: "http://imgur.com/1", timestamp: new Date().toISOString() 
      })
    });

    /**
     * Send a collision avoidance event
     */
    this.router.post('/obstacles', upload.single('file'), async (req: Request, res: Response) => {
      const { sessionId, x, y } = req.body;

      if (!req.file) {
        res.status(400).send('File not provided');
        return;
      }
      
      try {
        const filePath: string = req.file.path
        const classifiedImage = await this.collisionService.detectLabels(filePath);
        res.json(classifiedImage);
      } catch (error: unknown) {
        console.error('Error processing image brother:', (error as any).response.data);
        res.status(500).send('Error processing image');
      }
    });
  }
}
