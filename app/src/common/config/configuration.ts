import path from 'path';
import dotenv from 'dotenv';
import { validationSchema } from './validations';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

class Configurations {
  PORT: number = parseInt(process.env.PORT!);
  DATABASE_URL = process.env.DATABASE_URL;
  GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;
  GOOGLE_CLOUD_STORAGE_BUCKET = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  private static instance: Configurations | null = null;

  private static validateSchema(): void {
    const { error } = validationSchema
      .prefs({ errors: { label: 'key' } })
      .validate(process.env);

    if (error) throw new Error(error.message);
  }

  public static getInstance() {
    if (!Configurations.instance) {
      this.validateSchema();
      Configurations.instance = new Configurations();
    }

    return Configurations.instance;
  }
}

export const config = Configurations.getInstance();
