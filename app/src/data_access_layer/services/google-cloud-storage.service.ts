import { Storage as GoogleStorage } from '@google-cloud/storage';
import { Bucket as GoogleBucket } from '@google-cloud/storage/build/src/bucket';
import { config } from '../../common/config/configuration';
import { InternalServerError } from '../../common/errors';

export class GoogleCloudStorageService {
  private bucket: GoogleBucket;

  constructor() {
    const storage: GoogleStorage = new GoogleStorage();
    this.bucket = storage.bucket(config.GOOGLE_CLOUD_STORAGE_BUCKET!);
  }

  /**
   * Upload a file to Google Cloud Storage.
   * @param {string} fileName - The name of the file to be uploaded.
   * @param {Buffer} bufferData - The file data as a Buffer.
   * @returns {Promise<string>} The public URL of the uploaded file.
   * @throws {InternalServerError} If an error occurs while uploading the file.
   */
  public async upload(fileName: string, bufferData: Buffer): Promise<string> {
    const file = this.bucket.file(fileName);
    const stream = file.createWriteStream();

    return new Promise((resolve, reject) => {
      stream.on('error', (_) => {
        reject(
          new InternalServerError('An error occured while uploading the file'),
        );
      });

      stream.on('finish', async () => {
        await file.makePublic(); // access control permission must be set to Fine-grained
        const url: string = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
        resolve(url);
      });

      stream.end(bufferData);
    });
  }
}
