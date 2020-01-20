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
import { compact, isUndefined, map, pick } from 'lodash';
import { Permission } from 'src/permission/permission.interface';
import { PermissionService } from 'src/permission/permission.service';
import { ACTIVE_STATUS } from '../constants';
import { AddRolePermissionsDto } from './addRolePermissions.dto';
import { CreateRoleDto } from './createRole.dto';
import { Role } from './role.interface';
import {
  rolePermissionsValidationSchema,
  roleValidationSchema,
} from './role.schema';
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/permissions')
  async assignRolePermissions(
    @Param('id') id: string,
    @Body() addRolePermissionsDto: AddRolePermissionsDto,
  ): Promise<Role> {
    try {
      await rolePermissionsValidationSchema.validateAsync(
        addRolePermissionsDto,
      );

      const role = await this.roleService.find(id);

      if (!role) throw new Error('Not valid Role provided');

      const { permissions } = addRolePermissionsDto;
      const permissionsResolved = await Promise.all(
        permissions.map((permission: string) =>
          this.permissionService.find(permission),
        ),
      );
      const compactedPermissions = compact(permissionsResolved);

      if (!compactedPermissions.length)
        throw new Error('Not valid Permissions provided');

      const permissionsIds = map(compactedPermissions, '_id');
      const rolePermissionAssignated = await this.roleService.addRolePermissions(
        id,
        permissionsIds,
      );

      return rolePermissionAssignated;
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
