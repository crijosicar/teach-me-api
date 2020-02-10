import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SKILL_MODEL } from '../constants';
import { CreateSkillDto } from './dto/createSkill.dto';
import { Skill } from './interface/skill.interface';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(SKILL_MODEL) private readonly skillModel: Model<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.skillModel.find().exec();
  }

  async find(id: string): Promise<Skill> {
    return this.skillModel.findById(id);
  }

  async findByName(name: string): Promise<Skill> {
    return this.skillModel.findOne({ name }).exec();
  }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const createdSkill = new this.skillModel(createSkillDto);

    return createdSkill.save();
  }
}
