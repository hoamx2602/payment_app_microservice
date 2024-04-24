import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database';
import { ReservationDocument } from './reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReservationRepository extends AbstractRepository<ReservationDocument> {
  protected readonly logger = new Logger(ReservationRepository.name);

  constructor(
    @InjectModel(ReservationDocument.name) reservationModel: Model<ReservationDocument>
  ) {
    super(reservationModel)
  }
}
