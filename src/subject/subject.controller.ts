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
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { compact, isUndefined, map } from 'lodash';
import { EducationalLevelService } from 'src/educational-level/educational-level.service';
import { Role } from 'src/role/interface/role.interface';
import { ACTIVE_STATUS } from '../constants';
import { AddEduLevelSubjectDto } from './dto/addEduLevelSubject.dto';
import { CreateSubjectDto } from './dto/createSubject.dto';
import { Subject } from './interface/subject.interface';
import { eduLevelsValidationSchema } from './subject.schema';
import { subjectValidationSchema } from './subject.schema';
import { SubjectService } from './subject.service';
import { JoiValidationPipe } from 'src/common/joi-validation.pipe';

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
  @UsePipes(new JoiValidationPipe(subjectValidationSchema))
  async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    try {
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
  @UsePipes(new JoiValidationPipe(eduLevelsValidationSchema))
  async addEducationalLevelSubject(
    @Param('id') id: string,
    @Body() addEduLevelSubjectDto: AddEduLevelSubjectDto,
  ): Promise<Role> {
    try {
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
