import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({
  collection: 'users',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Math.floor(Date.now() / 1000),
  },
  versionKey: false,
})
@ObjectType()
export class UserDocument extends AbstractDocument {
  @Prop()
  @Field()
  email: string;

  @Prop()
  password: string;

  @Prop()
  @Field()
  created_at?: number;

  @Prop()
  @Field()
  updated_at?: number;

  @Prop()
  @Field(() => [String], { nullable: true })
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
