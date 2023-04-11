import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';
import { ImageClassificationService } from '../../../data_access_layer/services/image-classification.service';
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');



export class CollisionsRouter extends AbstractRouter {
  constructor() {
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
      
      const filePath: string = req.file.path

      try {
        const base64Image = fs.readFileSync(filePath, 'base64');
        const imageClassificationResponse = await new ImageClassificationService().detectLabels(base64Image);
        res.json(imageClassificationResponse);
      } catch (error: unknown) {
        console.error('Error processing image brother:', (error as any).response.data);
        res.status(500).send('Error processing image');
      }
    });
  }
}
