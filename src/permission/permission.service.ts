import { PERMISSION_MODEL } from '@app/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { Permission } from './interface/permission.interface';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PERMISSION_MODEL)
    private readonly roleModel: Model<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.roleModel.find().exec();
  }

  async find(id: string): Promise<Permission> {
    return this.roleModel.findById(id);
  }

  async findByName(name: string): Promise<Permission> {
    return this.roleModel.findOne({ name }).exec();
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const createdPermission = new this.roleModel(createPermissionDto);

    return createdPermission.save();
  }
}
