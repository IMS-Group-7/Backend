const { Storage } = require('@google-cloud/storage');
import { Bucket } from '@google-cloud/storage/build/src/bucket';
import { Readable } from 'stream';
const fs = require('fs');
const path = require('path');
import { config } from '../../common/config/configuration';

export interface FileStorageService  {
  createFile(fileName: string, base64String: string): Promise<string>;
  getFile(fileName: string): Promise<Buffer>;
  deleteFile(fileName: string): Promise<void>;
}

export class GoogleCloudFileStorageService implements FileStorageService {
  private bucket: Bucket;

  constructor() {
    const storage = new Storage();
    this.bucket = storage.bucket(config.GOOGLE_CLOUD_STORAGE_BUCKET);
  }

  public async createFile(fileName: string, base64String: string): Promise<string> {
    // Convert the base64 string to a buffer
    const buffer = Buffer.from(base64String, 'base64');
  
    // Create a ReadableStream from the buffer
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
  
    // Create a File object for the destination file
    const file = this.bucket.file(fileName);
  
    // Upload the stream to Google Cloud Storage
    await new Promise((resolve, reject) => {
      readableStream
        .pipe(file.createWriteStream({
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        }))
        .on('error', reject)
        .on('finish', resolve);
    });
  
    const baseUrl = `https://storage.googleapis.com/${this.bucket.name}`;
    const fileUrl = `${baseUrl}/${encodeURIComponent(fileName)}`;
    return fileUrl;
  }

  public async getFile(fileName: string): Promise<Buffer> {
    const file = this.bucket.file(fileName);
    const [content] = await file.download();
    return content;
  }

  public async deleteFile(fileName: string): Promise<void> {
    await this.bucket.file(fileName).delete();
  }
}

export class LocalFileStorageService implements FileStorageService {
  private storagePath: string;

  constructor() {
    this.storagePath = path.join(__dirname, 'storage');
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath);
    }
  }

  public async createFile(fileName: string, base64String: string): Promise<string> {
    const destinationPath = path.join(this.storagePath, fileName);
    const buffer = Buffer.from(base64String, 'base64');
    await fs.promises.writeFile(destinationPath, buffer);
    return destinationPath;
  }

  public async getFile(fileName: string): Promise<Buffer> {
    const filePath = path.join(this.storagePath, fileName);
    if (fs.existsSync(filePath)) {
      return fs.promises.readFile(filePath);
    }
    throw new Error('File not found');
  }

  public async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.storagePath, fileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    } else {
      throw new Error('File not found');
    }
  }
}