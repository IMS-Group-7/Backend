import { NotFoundError } from '../../common/errors';
import { ImageClassificationService } from '../../data_access_layer/services/image-classification.service';
import { AxiosResponse } from 'axios';
const fs = require('fs');

export class CollisionService {
  constructor(private imageClassificationService: ImageClassificationService) {}

  public async detectLabels(filePath: string): Promise<AxiosResponse> {
    const base64Image: string = fs.readFileSync(filePath, 'base64');
    return this.imageClassificationService.detectLabels(base64Image);
  }
}
