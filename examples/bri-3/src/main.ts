import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //Please refer and document here: https://github.com/eea-oasis/baseline/issues/593
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
