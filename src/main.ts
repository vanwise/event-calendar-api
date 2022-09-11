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
  const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
  };
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  const port = process.env.PORT || 3001;

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

  setupSwagger(app);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory: transformErrors }));
  await app.listen(port);
}
bootstrap();
