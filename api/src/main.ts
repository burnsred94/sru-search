import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RabbitMqPublisher } from './modules/rabbitmq/services';
import { RpcExceptionFilter } from './modules/rabbitmq/utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix(`${configService.get('PROJECT_PREFIX')}`);

  app.enableCors();

  app.get(RabbitMqPublisher);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RpcExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE'))
    .setDescription(configService.get('SWAGGER_DESCRIPTION'))
    .setVersion(configService.get('PROJECT_VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`api-${configService.get('PROJECT')}`, app, document);
  await app.listen(configService.get('PORT'));
}

bootstrap();
