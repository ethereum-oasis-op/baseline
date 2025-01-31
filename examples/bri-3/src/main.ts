import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //Please refer and document here: https://github.com/ethereum-oasis-op/baseline/issues/593
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
