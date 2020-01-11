import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL } from '../constants';
import { CreateUserDto } from './createUser.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async find(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel
      .findOne({ email })
      .select('+password')
      .exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
}
