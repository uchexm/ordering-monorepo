import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from './services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    return this.authClient.send<boolean, string>('validate_user', authentication).pipe(
        tap((res) => {
            this.addUser(res, context)
        }),
        catchError(() => {
            throw new UnauthorizedException('Invalid authentication');
        })
    );
  }

  private getAuthentication(context: ExecutionContext): string {
    let authentication: string | undefined; // Initialize to undefined
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      authentication = context.switchToHttp().getRequest().cookies?.Authentication;
    }
    if (!authentication) {
      throw new Error('No authentication provided');
    }
    return authentication;
  }
  
  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}