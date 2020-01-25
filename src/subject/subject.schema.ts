import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';

export const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, index: true, unique: true, required: true },
    description: { type: String, required: false },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const subjectValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  description: Joi.string(),
});

export const eduLevelsValidationSchema = Joi.object({
  educationalLevels: Joi.array()
    .items(Joi.string())
    .required(),
});
