import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, index: true, unique: true, required: true },
  password: { type: String, required: true, select: false },
  birthdate: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const userValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  password: Joi.string(),
  birthdate: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
});
