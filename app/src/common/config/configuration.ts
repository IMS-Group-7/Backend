import path from 'path';
import dotenv from 'dotenv';
import { validationSchema } from './validations';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

class Configurations {
  PORT: number = parseInt(process.env.PORT!);
  MAXIMUM_REQUEST_BODY_SIZE = process.env.MAXIMUM_REQUEST_BODY_SIZE;

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
