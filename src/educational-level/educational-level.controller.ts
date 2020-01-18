import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACTIVE_STATUS } from 'src/constants';
import { isUndefined } from 'util';
import { CreateEduLevelDto } from './createEduLevel.dto';
import { EducationalLevel } from './educational-level.interface';
import { educationalLevelValidationSchema } from './educational-level.schema';
import { EducationalLevelService } from './educational-level.service';

@Controller('educational-level')
export class EducationalLevelController {
  constructor(
    private readonly educationalLevelService: EducationalLevelService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<EducationalLevel[]> {
    return this.educationalLevelService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<EducationalLevel> {
    return this.educationalLevelService.find(id);
  }

  @Post()
  async create(
    @Body() createEduLevelDto: CreateEduLevelDto,
  ): Promise<EducationalLevel> {
    try {
      await educationalLevelValidationSchema.validateAsync(createEduLevelDto);

      const createdAt = new Date().valueOf().toString();

      const createEduLevelCreated = await this.educationalLevelService.create({
        ...createEduLevelDto,
        createdAt,
        status: ACTIVE_STATUS,
      });

      return createEduLevelCreated;
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
