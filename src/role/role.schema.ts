import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';
import { PERMISSION_MODEL } from 'src/constants';

export const RoleSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    name: { type: String, index: true, unique: true, required: true },
    permissions: [
      {
        ref: PERMISSION_MODEL,
        required: false,
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const roleValidationSchema = Joi.object({
  description: Joi.string(),
  name: Joi.string()
    .min(3)
    .required(),
});

export const rolePermissionsValidationSchema = Joi.object({
  permissions: Joi.array()
    .items(Joi.string())
    .required(),
});
