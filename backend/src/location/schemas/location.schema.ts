import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocationDocument = Location & Document;

export interface ILocation {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  userId: string;
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
      name: string;

  @Prop()
      latitude: string;

  @Prop({ required: true })
      longitude: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
      userId: Types.ObjectId;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
