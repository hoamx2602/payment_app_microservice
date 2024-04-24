import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';

@Schema({
  collection: 'reservations',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Math.floor(Date.now() / 1000),
  },
  versionKey: false,
})
export class ReservationDocument extends AbstractDocument {
  @Prop()
  timestamp: Date

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  user_id: string;

  @Prop()
  place_id: string;

  @Prop()
  invoice_id: string;
}

export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument);