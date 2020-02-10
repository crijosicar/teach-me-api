import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL } from '../constants';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './interface/user.interface';

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

  async addRoleToUserById(userId: string, rolesIds: string[]): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { roles: rolesIds } },
      { new: true },
    );
  }

  async addSubjectsToUserById(
    userId: string,
    subjectsIds: string[],
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { subjects: subjectsIds } },
      { new: true },
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async addAvatarToUserById(userId: string, filePath: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { avatars: filePath } },
      { new: true },
    );
  }

  async addSkillsToUserById(
    userId: string,
    skillsIds: string[],
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { skills: skillsIds } },
      { new: true },
    );
  }

  async addCoursesToUserById(
    userId: string,
    coursesIds: string[],
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { courses: coursesIds } },
      { new: true },
    );
  }

  async addStudiesToUserById(
    userId: string,
    studiesIds: string[],
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { studies: studiesIds } },
      { new: true },
    );
  }
}
