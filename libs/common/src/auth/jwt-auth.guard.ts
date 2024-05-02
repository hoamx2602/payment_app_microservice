import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AUTHENTICATE_MSG, AUTH_SERVICE } from "../constants";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient.send<UserDto>(AUTHENTICATE_MSG, {
      Authentication: jwt
    }).pipe(
      tap((res) => {
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true),
      catchError(() => of(false))
    )
  }
}
