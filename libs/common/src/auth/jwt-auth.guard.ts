import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Logger } from "@nestjs/common";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AUTHENTICATE_MSG, AUTH_SERVICE } from "../constants";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies?.Authentication || request?.headers.authentication;

    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient.send<UserDto>(AUTHENTICATE_MSG, {
      Authentication: jwt
    }).pipe(
      tap((res) => {
        if (roles) {
          for(const role of roles) {
            if (!res.roles?.includes(role)) {
              this.logger.error("The user does not have valid role")
              throw new ForbiddenException();
            }
          }
        }
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true),
      catchError((err) => {
        this.logger.error(err);
        return of(false)
      })
    )
  }
}
