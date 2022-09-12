import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 3001;
  const TEN_MINUTES_IN_SEC = 600;
  const app = await NestFactory.create(AppModule);

  function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Event Calendar')
      .setDescription('REST API documentation')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/api', app, document);
  }

  function transformErrors(errors) {
    const messages = Object.fromEntries(
      errors.map(({ property, constraints }) => [
        property,
        Object.values(constraints),
      ]),
    );
    throw new BadRequestException({ messages });
  }

  app.enableCors({
    maxAge: TEN_MINUTES_IN_SEC,
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  setupSwagger(app);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory: transformErrors }));
  await app.listen(port);
}
bootstrap();
