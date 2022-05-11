import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Warning: In order for this decorator to work, you must use
 * @UseGuards(SessionAuthGuard)!
 */
export const UserId = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.userId;
  }
);
