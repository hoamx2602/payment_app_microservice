import { UserDocument } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async login (user: UserDocument, response: Response): Promise<string> {
    const tokenPayload = {
      userId: user._id.toHexString(),
    }

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get<number>("JWT_EXPIRATION"));

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
    });

    return token;
  }
}
