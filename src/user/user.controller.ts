import { editFileName, imageFileFilter } from '@app/common/file-upload.util';
import { JoiValidationPipe } from '@app/common/joi-validation.pipe';
import { ACTIVE_STATUS, STUDENT_ROLE } from '@app/constants';
import { RoleService } from '@app/role/role.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { hash } from 'bcrypt';
import { Response } from 'express';
import { compact, isUndefined, last, map } from 'lodash';
import { diskStorage } from 'multer';
import { AdditionalDataUserDto } from './dto/additionalDataUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './interface/user.interface';
import {
  additionalUserDataValidationSchema,
  userValidationSchema,
} from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<User> {
    return this.userService.find(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(userValidationSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password } = createUserDto;
      const passHash = await hash(password, 10);

      const userCreated = await this.userService.create({
        ...createUserDto,
        password: passHash,
        status: ACTIVE_STATUS,
      });

      const studentRole = await this.roleService.findByName(STUDENT_ROLE);

      if (!studentRole) throw new Error('Role provided does not exist.');

      await this.userService.addRoleToUserById(userCreated.id, [
        studentRole.id,
      ]);

      return userCreated;
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
  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: editFileName,
      }),
    }),
  )
  async uploadFile(@Param('id') id: string, @UploadedFile() file: any) {
    try {
      const { originalname, path } = file;

      await this.userService.addAvatarToUserById(id, path);

      return {
        originalname,
      };
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
  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.find(id);
      const avatar = last(compact(user.avatars));
      res.sendFile(avatar, { root: './' });
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
  @Post(':id/additional-data')
  async setAdditionalData(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(additionalUserDataValidationSchema))
    additionalDataUserDto: AdditionalDataUserDto,
  ) {
    try {
      const user = await this.userService.find(id);

      if (!user) throw new Error('User provided does not exist.');

      const { courses, studies, skills } = additionalDataUserDto;

      if (courses)
        await this.userService.addCoursesToUserById(id, map(courses, '_id'));

      if (skills)
        await this.userService.addSkillsToUserById(id, map(skills, '_id'));

      if (studies)
        await this.userService.addStudiesToUserById(id, map(studies, '_id'));
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
