import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UserService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles) {
      return true;
    }
    const context = GqlExecutionContext.create(ctx);
    const request = context.getContext().req;
    const user = await this.usersService.getUserById(request.userId);
    return roles.includes(user.role);
  }
}
