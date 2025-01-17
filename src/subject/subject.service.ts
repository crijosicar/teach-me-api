import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SUBJECT_MODEL } from '../constants';
import { CreateSubjectDto } from './createSubject.dto';
import { Subject } from './subject.interface';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(SUBJECT_MODEL) private readonly subjectModel: Model<Subject>,
  ) {}

  async find(id: string): Promise<Subject> {
    return this.subjectModel.findById(id);
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectModel.find().exec();
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const createdSubject = new this.subjectModel(createSubjectDto);
    return await createdSubject.save();
  }

  async addEducationalLevelsSubject(
    subjectId: string,
    educationalLevelsIds: string[],
  ): Promise<Subject> {
    return this.subjectModel.findByIdAndUpdate(
      subjectId,
      { $addToSet: { educationalLevels: educationalLevelsIds } },
      { new: true },
    );
  }
}
