import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { isUndefined } from 'lodash';
import { ACTIVE_STATUS } from '../constants';
import { CreateSubjectDto } from './createSubject.dto';
import { Subject } from './subject.interface';
import { subjectValidationSchema } from './subject.schema';
import { SubjectService } from './subject.service';

@Controller('subject')
@UseInterceptors(CacheInterceptor)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async findAll(): Promise<Subject[]> {
    return this.subjectService.findAll();
  }

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    try {
      await subjectValidationSchema.validateAsync(createSubjectDto);

      const createdAt = new Date().valueOf().toString();

      const subjectCreated = await this.subjectService.create({
        ...createSubjectDto,
        createdAt,
        status: ACTIVE_STATUS,
      });
      return subjectCreated;
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
