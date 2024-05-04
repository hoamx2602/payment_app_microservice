import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, User, UsersRepository } from '@app/common';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      roles: createUserDto.roles?.map((roleDto) => new Role(roleDto)),
    });
    return this.usersRepository.create(user);
  }

  private async validateCreateUser(createUserDto: CreateUserDto) {
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
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }
}
