import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authService: AuthServiceClient;
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt =
      request.cookies?.Authentication || request?.headers.authentication;

    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authService
      .authenticate({
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.includes(role)) {
                this.logger.error('The user does not have valid role');
                throw new ForbiddenException();
              }
            }
          }
          context.switchToHttp().getRequest().user = {
            ...res,
            _id: res.id
          };
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
