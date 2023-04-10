import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export class ImageClassificationService {
  private readonly apiKey: string = process.env.GOOGLE_VISION_API_KEY || '';
  private readonly apiEndpoint: string = 'https://vision.googleapis.com/v1/images:annotate';
  
  public async detectLabels(base64Image: string): Promise<any> {
    // console.log("BASE64: ", base64Image);
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
            },
          ],
        },
      ],
    };

    const requestUrl = `${this.apiEndpoint}?key=${this.apiKey}`;
    const response: AxiosResponse = await axios.post(requestUrl, requestBody);
    return response.data;
  }
}