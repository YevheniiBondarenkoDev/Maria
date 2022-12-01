import { Injectable } from '@nestjs/common';
import {
  DocumentDefinition,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  create(userData: DocumentDefinition<User>) {
    return this.userModel.create(userData);
  }
  findOne(
    filter?: FilterQuery<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>,
  ) {
    return this.userModel.findOne(filter, projection, options);
  }
  findById(
    id: string,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    return this.userModel.findById(id, projection, options);
  }
  updateOne(
    filter?: FilterQuery<User>,
    updateQuery?: UpdateQuery<User>,
    options?: QueryOptions<User>,
  ) {
    return this.userModel.findOneAndUpdate(filter, updateQuery, options);
  }
}
