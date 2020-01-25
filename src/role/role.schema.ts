import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';
import { PERMISSION_MODEL } from 'src/constants';

export const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, index: true, unique: true, required: true },
    description: { type: String, required: true },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: PERMISSION_MODEL,
        required: false,
      },
    ],
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const roleValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  description: Joi.string(),
});

export const rolePermissionsValidationSchema = Joi.object({
  permissions: Joi.array()
    .items(Joi.string())
    .required(),
});
