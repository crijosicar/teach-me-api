import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isUndefined } from 'lodash';
import { ACTIVE_STATUS } from '../constants';
import { CreateSkillDto } from './dto/createSkill.dto';
import { Skill } from './interface/skill.interface';
import { skillValidationSchema } from './skill.schema';
import { SkillService } from './skill.service';
import { JoiValidationPipe } from 'src/common/joi-validation.pipe';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Skill[]> {
    return this.skillService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<Skill> {
    return this.skillService.find(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(skillValidationSchema))
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    try {
      const createdAt = new Date().valueOf().toString();
      const skillCreated = await this.skillService.create({
        ...createSkillDto,
        createdAt,
        status: ACTIVE_STATUS,
      });

      return skillCreated;
    } catch (error) {
      const message = isUndefined(error.response)
        ? error.message
        : error.response.data;
      const statusCode = isUndefined(error.response)
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : error.response.status;
      throw new HttpException(message, statusCode);
    }
  }
}
