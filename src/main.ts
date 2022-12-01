import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: 'keyboard',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json({ limit: '10mb' }));

  await app.listen(process.env.PORT);
}
bootstrap();
