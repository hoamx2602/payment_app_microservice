import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from '@app/common';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUser: CreateUserDto) {
    await this.validateCreateUserDto(createUser);
    return this.usersRepository.create({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    const existUserEmail = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    if (existUserEmail) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credential is invalid');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async findAll() {
    return this.usersRepository.find({});
  }
}
