import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({
  collection: 'reservations',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Math.floor(Date.now() / 1000),
  },
  versionKey: false,
})
@ObjectType()
export class ReservationDocument extends AbstractDocument {
  @Prop()
  @Field()
  timestamp: Date;

  @Prop()
  @Field()
  start_date: Date;

  @Prop()
  @Field()
  end_date: Date;

  @Prop()
  @Field()
  user_id: string;

  @Prop()
  @Field()
  invoice_id: string;

  @Prop()
  @Field()
  created_at?: number;

  @Prop()
  @Field()
  updated_at?: number;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
