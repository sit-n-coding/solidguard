import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

// Source: https://docs.nestjs.com/security/rate-limiting

// TODO: Uncomment for GraphQL.
@Injectable()
export class ThrottlerGuardBehindProxy extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.ips.length ? req.ips[0] : req.ip;
  }

  //   getRequestResponse(context: ExecutionContext) {
  //     const gqlCtx = GqlExecutionContext.create(context);
  //     const ctx = gqlCtx.getContext();
  //     return { req: ctx.req, res: ctx.req.res }
  //   }
}
