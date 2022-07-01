import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    return roles
      ? !!roles.find((role) => user.role === role)
      : user.role == 'admin';
  }
}
