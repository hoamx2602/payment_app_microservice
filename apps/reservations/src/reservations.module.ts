import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AUTH_QUEUE, AUTH_SERVICE, DatabaseModule, HealthModule, LoggerModule, PAYMENTS_QUEUE, PAYMENTS_SERVICE } from '@app/common';
import {
  ReservationDocument,
  ReservationRepository,
  ReservationSchema,
} from '@app/common/schemas';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: ReservationDocument.name,
        schema: ReservationSchema,
      },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
      })
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBIT_MQ_URI")],
            queue: AUTH_QUEUE
          }
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBIT_MQ_URI")],
            queue: PAYMENTS_QUEUE
          }
        }),
        inject: [ConfigService]
      }
    ]),
    HealthModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
