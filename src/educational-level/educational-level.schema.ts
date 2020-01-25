import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';

export const EducationalLevelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const educationalLevelValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  description: Joi.string()
    .min(3)
    .required(),
});
