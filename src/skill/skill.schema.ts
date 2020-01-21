import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';
import { ROLE_MODEL, SUBJECT_MODEL } from '../constants';

export const SkillSchema = new mongoose.Schema({
  name: { type: String, index: true, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const skillValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  description: Joi.string(),
});
