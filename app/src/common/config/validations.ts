import * as Joi from 'joi';

export const validationSchema = Joi.object()
  .keys({
    PORT: Joi.number().required(),
  })
  .unknown();
