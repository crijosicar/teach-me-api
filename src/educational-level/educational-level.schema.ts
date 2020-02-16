import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';

export const EducationalLevelSchema = new mongoose.Schema(
  {
    description: { type: String },
    name: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const educationalLevelValidationSchema = Joi.object({
  description: Joi.string()
    .min(3)
    .required(),
  name: Joi.string()
    .min(3)
    .required(),
});
