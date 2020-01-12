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
import { isUndefined } from 'lodash';
import { Permission } from 'src/permission/permission.interface';
import { PermissionService } from 'src/permission/permission.service';
import { ACTIVE_STATUS } from '../constants';
import { CreateRoleDto } from './createRole.dto';
import { Role } from './role.interface';
import { roleValidationSchema } from './role.schema';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<Role> {
    return this.roleService.find(id);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      await roleValidationSchema.validateAsync(createRoleDto);

      const resolvedPromisesArray = await Promise.all(
        createRoleDto.permissions.map(
          (permissionId: string): Promise<Permission> => {
            return this.permissionService.find(permissionId);
          },
        ),
      );

      console.log('resolvedPromisesArray => ', resolvedPromisesArray);

      const createdAt = new Date().valueOf().toString();

      const roleCreated = await this.roleService.create({
        ...createRoleDto,
        createdAt,
        status: ACTIVE_STATUS,
      });

      return roleCreated;
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
