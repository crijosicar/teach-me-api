import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { compact, isUndefined, map } from 'lodash';
import { EducationalLevelService } from 'src/educational-level/educational-level.service';
import { Role } from 'src/role/role.interface';
import { ACTIVE_STATUS } from '../constants';
import { AddEduLevelSubjectDto } from './addEduLevelSubject.dto';
import { CreateSubjectDto } from './createSubject.dto';
import { Subject } from './subject.interface';
import { eduLevelsValidationSchema } from './subject.schema';
import { subjectValidationSchema } from './subject.schema';
import { SubjectService } from './subject.service';

@Controller('subject')
@UseInterceptors(CacheInterceptor)
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly educationalLevelService: EducationalLevelService,
  ) {}

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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/educational-levels')
  async addEducationalLevelSubject(
    @Param('id') id: string,
    @Body() addEduLevelSubjectDto: AddEduLevelSubjectDto,
  ): Promise<Role> {
    try {
      await eduLevelsValidationSchema.validateAsync(addEduLevelSubjectDto);

      const subject = await this.subjectService.find(id);

      if (!subject) throw new Error('Not valid Subject provided');

      const { educationalLevels } = addEduLevelSubjectDto;
      const educationalLevelsResolved = await Promise.all(
        educationalLevels.map((educationalLevel: string) =>
          this.educationalLevelService.find(educationalLevel),
        ),
      );
      const compactedEducationalLevels = compact(educationalLevelsResolved);

      if (!compactedEducationalLevels.length)
        throw new Error('Not valid Educational Levels provided');

      const educationalLevelsIds = map(compactedEducationalLevels, '_id');
      const educationalLevelsAssigned = await this.subjectService.addEducationalLevelsSubject(
        id,
        educationalLevelsIds,
      );

      return educationalLevelsAssigned;
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
