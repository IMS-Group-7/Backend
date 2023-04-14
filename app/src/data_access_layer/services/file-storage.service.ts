const { Storage } = require('@google-cloud/storage');
import { Bucket } from '@google-cloud/storage/build/src/bucket';

import { config } from 'dotenv';
config();

export class GoogleCloudFileStorageService {
  private bucket: Bucket;

  constructor() {
    const storage = new Storage();
    this.bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
  }

  public async uploadFile(filePath: string, fileName: string): Promise<void> {
    await this.bucket.upload(filePath, {
      destination: fileName,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
  }

  public async deleteFile(fileName: string): Promise<void> {
    await this.bucket.file(fileName).delete();
  }
}