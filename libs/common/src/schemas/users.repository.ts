import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database';
import { UserDocument } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(UserDocument.name) userModel: Model<UserDocument>
  ) {
    super(userModel);
  }
}
