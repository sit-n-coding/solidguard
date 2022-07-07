import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Note: In order for this decorator to work, you must use
 * @UseGuards(SessionAuthGuard)!
 */
export const UserId = createParamDecorator(
  (_: string, ctx: ExecutionContext): string => {
    const context = GqlExecutionContext.create(ctx);
    const request = context.getContext().req;
    return request.userId;
  }
);
