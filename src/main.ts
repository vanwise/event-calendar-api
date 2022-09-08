import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Event Calendar')
    .setDescription('REST API documentation')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
