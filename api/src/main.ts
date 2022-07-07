import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import createRedisStore from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation + Transformer
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Cors (only use when doing local dev work)
  if (process.env.CORS && process.env.CORS.toLowerCase() === 'true') {
    app.enableCors();
  }

  // create initial admin account if it doesn't exist already
  const userService = app.get<UserService>(UserService);
  if (
    process.env.ADMIN_USERNAME &&
    !(await userService.getUserByEmail(process.env.ADMIN_USERNAME))
  ) {
    await userService.createAccount({
      name: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: Role.ADMIN,
    });
  }

  // init redis
  // from: https://dnlytras.com/snippets/redis-session/
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  });

  // enable cookies & session combo
  // from: https://dnlytras.com/snippets/redis-session/
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: new RedisStore({ client: redisClient as any }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure:
          process.env.SECURE && process.env.SECURE.toLowerCase() === 'true',
        maxAge: parseInt(process.env.MAX_AGE),
      },
    })
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
