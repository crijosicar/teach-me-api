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
import { JoiValidationPipe } from 'src/common/joi-validation.pipe';
import { ACTIVE_STATUS } from 'src/constants';
import { CreateEduLevelDto } from './dto/createEduLevel.dto';
import { educationalLevelValidationSchema } from './educational-level.schema';
import { EducationalLevelService } from './educational-level.service';
import { EducationalLevel } from './interface/educational-level.interface';

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
  @UsePipes(new JoiValidationPipe(educationalLevelValidationSchema))
  async create(
    @Body() createEduLevelDto: CreateEduLevelDto,
  ): Promise<EducationalLevel> {
    try {
      return this.educationalLevelService.create({
        ...createEduLevelDto,
        status: ACTIVE_STATUS,
      });
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
