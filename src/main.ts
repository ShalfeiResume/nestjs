if(!process.env.IS_DEVELOP_MODE){
  require('module-alias/register')
}

import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:8080',
    ],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
