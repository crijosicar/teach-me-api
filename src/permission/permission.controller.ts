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
import { JoiValidationPipe } from 'src/common/joi-validation.pipe';
import { ACTIVE_STATUS } from 'src/constants';
import { isUndefined } from 'util';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { Permission } from './interface/permission.interface';
import { permissionValidationSchema } from './permission.schema';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<Permission> {
    return this.permissionService.find(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(permissionValidationSchema))
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    try {
      return this.permissionService.create({
        ...createPermissionDto,
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
