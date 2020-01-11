import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';
import { ROLE_MODEL } from '../constants';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, index: true, unique: true, required: true },
  password: { type: String, required: true, select: false },
  birthdate: { type: String, required: true },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: ROLE_MODEL,
    },
  ],
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
