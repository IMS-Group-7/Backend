import { ImageAnnotatorClient } from '@google-cloud/vision';
import { config } from '../../common/config/configuration';
import { NotFoundError } from '../../common/errors';

export class ImageClassificationService {
  private readonly imageAnnotatorClient: ImageAnnotatorClient;

  constructor() {
    const options = { keyfile: config.GOOGLE_APPLICATION_CREDENTIALS };
    this.imageAnnotatorClient = new ImageAnnotatorClient(options);
  }

  /**
   * Classify an image using the Vision API.
   * @param {Buffer} bufferData - The image data as a Buffer.
   * @returns {Promise<string>} The classification label for the image.
   * @throws {NotFoundError} If no label annotations are found in the image.
   */
  public async classifyImage(bufferData: Buffer): Promise<string> {
    const request = {
      image: {
        content: bufferData,
      },
      features: [
        {
          type: 'LABEL_DETECTION',
        },
      ],
    };

    const [result] = await this.imageAnnotatorClient.annotateImage(request);
    const labelAnnotations = result.labelAnnotations;

    if (labelAnnotations && labelAnnotations.length > 0) {
      const label: string | null | undefined = labelAnnotations[0].description;

      if (!label) throw new NotFoundError('No labels detected');

      return label;
    }

    throw new NotFoundError('No labels detected');
  }
}
