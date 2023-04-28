import * as Joi from 'joi';

export const validationSchema = Joi.object()
  .keys({
    PORT: Joi.number().required(),
    DATABASE_URL: Joi.string().required(),
    GOOGLE_VISION_API_KEY: Joi.string().required(),
    GOOGLE_CLOUD_STORAGE_BUCKET: Joi.string().required(),
    GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),
  })
  .unknown();
