import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';

export const PermissionSchema = new mongoose.Schema({
  name: { type: String, index: true, unique: true, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const permissionValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  description: Joi.string(),
});
