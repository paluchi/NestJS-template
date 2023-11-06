import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe is a pipe that uses class-validator to transform and validate payloads
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS with default settings
  app.enableCors();

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('My PoC API')
    .setDescription(
      'This API provides a simple way to auth and manage Meals and ratings',
    )
    .setVersion('1.0')
    // used jwt as auth method
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI
  SwaggerModule.setup('api-docs', app, document);

  // Start the application on port 4000
  await app.listen(4000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
