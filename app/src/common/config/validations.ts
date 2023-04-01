import * as Joi from 'joi';

export const validationSchema = Joi.object()
  .keys({
    PORT: Joi.number().required(),
    MAXIMUM_REQUEST_BODY_SIZE: Joi.string().required(),
  })
  .unknown();
