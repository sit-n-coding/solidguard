import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // attach session userId to request
    if (request.session.userId) {
      request.userId = request.session.userId;
      return true;
    }
    return false;
  }
}
