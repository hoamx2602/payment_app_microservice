import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUser: CreateUserDto) {
    await this.validateCreateUserDto(createUser);
    return this.prismaService.user.create({
      data: {
        ...createUser,
        password: await bcrypt.hash(createUser.password, 10),
      },
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    const existUserEmail = await this.prismaService.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUserEmail) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credential is invalid');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.prismaService.user.findFirstOrThrow({
      where: {
        id: +getUserDto.id,
      },
    });
  }
}
