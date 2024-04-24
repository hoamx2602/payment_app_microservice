import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common';
import { ReservationDocument, ReservationRepository, ReservationSchema } from '@app/common/schemas';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([
    {
      name: ReservationDocument.name,
      schema: ReservationSchema
    }
  ])],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
