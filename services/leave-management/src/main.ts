/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app/app.module';
import { createDocument } from './swagger/swagger';
import { HttpExceptionFilter } from '@hrexpert/backend-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });

  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  app.use(bodyParser.urlencoded({ limit: configService.get('maxPayloadSize'), extended: true }));
  app.use(bodyParser.json({ limit: configService.get('maxPayloadSize') }));
  app.useGlobalPipes(new ValidationPipe({ validationError: { target: false }, transform: true, forbidUnknownValues: false }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());

  // if (configService.get('env') === 'development') {
  createDocument(app);
  // }

  const server = await app.listen(configService.get('port'));
  server.setTimeout(1000 * configService.get('responseTimeOut'));
  Logger.log(`🚀 LMS service - http://localhost:${configService.get('port')}/api`);
}

bootstrap();
