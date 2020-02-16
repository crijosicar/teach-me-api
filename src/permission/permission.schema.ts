import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';

export const PermissionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    name: { type: String, index: true, unique: true, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const permissionValidationSchema = Joi.object({
  description: Joi.string(),
  name: Joi.string()
    .min(3)
    .required(),
});
