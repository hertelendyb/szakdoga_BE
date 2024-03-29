import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.set('trust proxy');
  app.use(
    session({
      secret: 'keyboard',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      },
    }),
  );
  app.enableCors();
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json({ limit: '10mb' }));

  await app.listen(process.env.PORT);
}
bootstrap();
