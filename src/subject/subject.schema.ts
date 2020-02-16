import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';

export const SubjectSchema = new mongoose.Schema(
  {
    description: { type: String, required: false },
    name: { type: String, index: true, unique: true, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const subjectValidationSchema = Joi.object({
  description: Joi.string(),
  name: Joi.string()
    .min(3)
    .required(),
});

export const eduLevelsValidationSchema = Joi.object({
  educationalLevels: Joi.array()
    .items(Joi.string())
    .required(),
});
