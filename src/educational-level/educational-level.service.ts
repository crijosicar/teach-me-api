import { EDUCATIONAL_LEVEL_MODEL } from '@app/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEduLevelDto } from './dto/createEduLevel.dto';
import { EducationalLevel } from './interface/educational-level.interface';

@Injectable()
export class EducationalLevelService {
  constructor(
    @InjectModel(EDUCATIONAL_LEVEL_MODEL)
    private readonly educationalLevelModel: Model<EducationalLevel>,
  ) {}

  async findAll(): Promise<EducationalLevel[]> {
    return this.educationalLevelModel.find().exec();
  }

  async find(id: string): Promise<EducationalLevel> {
    return this.educationalLevelModel.findById(id);
  }

  async findByName(name: string): Promise<EducationalLevel> {
    return this.educationalLevelModel.findOne({ name }).exec();
  }

  async create(
    createEduLevelDto: CreateEduLevelDto,
  ): Promise<EducationalLevel> {
    const createdPermission = new this.educationalLevelModel(createEduLevelDto);

    return createdPermission.save();
  }
}
