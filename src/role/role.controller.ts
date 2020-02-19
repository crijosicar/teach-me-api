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
import { compact, isUndefined, map } from 'lodash';
import { JoiValidationPipe } from 'src/common/joi-validation.pipe';
import { PermissionService } from 'src/permission/permission.service';
import { ACTIVE_STATUS } from '../constants';
import { AddRolePermissionsDto } from './dto/addRolePermissions.dto';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role } from './interface/role.interface';
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
  @UsePipes(new JoiValidationPipe(roleValidationSchema))
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return this.roleService.create({
        ...createRoleDto,
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/permissions')
  @UsePipes(new JoiValidationPipe(rolePermissionsValidationSchema))
  async assignRolePermissions(
    @Param('id') id: string,
    @Body() addRolePermissionsDto: AddRolePermissionsDto,
  ): Promise<Role> {
    try {
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

      return this.roleService.addRolePermissions(id, permissionsIds);
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
