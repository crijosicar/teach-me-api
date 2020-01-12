import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';
import { PERMISSION_MODEL } from 'src/constants';

export const RoleSchema = new mongoose.Schema({
  name: { type: String, index: true, unique: true, required: true },
  description: { type: String, required: true },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: PERMISSION_MODEL,
      required: true,
    },
  ],
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const roleValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  description: Joi.string(),
  permissions: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
});
