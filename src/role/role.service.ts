import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ROLE_MODEL } from '../constants';
import { AssignRolePermissionsDto } from './assignRolePermissions.dto';
import { CreateRoleDto } from './createRole.dto';
import { Role } from './role.interface';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(ROLE_MODEL) private readonly roleModel: Model<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async find(id: string): Promise<Role> {
    return this.roleModel.findById(id);
  }

  async findByName(name: string): Promise<Role> {
    return this.roleModel.findOne({ name }).exec();
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async addRolePermissions(
    roleId: string,
    permissionsIds: string[],
  ): Promise<Role> {
    return this.roleModel.findByIdAndUpdate(roleId, {
      $addToSet: { permissions: permissionsIds },
    });
  }
}
