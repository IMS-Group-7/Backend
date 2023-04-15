import { ImageAnnotatorClient } from '@google-cloud/vision';
import dotenv from 'dotenv';

dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export class ImageClassificationService {
  private readonly client: ImageAnnotatorClient;

  constructor() {
    const options = { keyfile: process.env.GOOGLE_APPLICATION_CREDENTIALS }
    this.client = new ImageAnnotatorClient(options);
  }

  public async getClassifiedImage(base64Image: string): Promise<string> {
    const request = {
      image: {
        content: base64Image,
      },
      features: [
        {
          type: 'LABEL_DETECTION',
        },
      ],
    };
  
    const [result] = await this.client.annotateImage(request);
    const labelAnnotations = result.labelAnnotations;
  
    if (labelAnnotations && labelAnnotations.length > 0) {
      return labelAnnotations[0].description || 'No description available';
    } else {
      throw new Error("No labels detected");
    }
  }
}