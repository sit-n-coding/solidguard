import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Swagger Api
  const options = new DocumentBuilder()
    .setTitle('SolidGuard Backend')
    .setDescription("SolidGuard's Backend Server")
    .setVersion('prototype-v1.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  // Cors
  app.enableCors();

  // create initial admin account if it doesn't exist already
  const userService = app.get<UserService>(UserService);
  if (!(await userService.getUserByEmail(process.env.ADMIN_EMAIL))) {
    await userService.createAccount({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: Role.ADMIN,
    });
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
