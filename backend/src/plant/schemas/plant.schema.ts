import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlantDocument = Plant & Document;

export interface IPlant {
  _id: string;
  name: string;
  type: string;
  weeklyWaterNeed: number; // ml
  expectedHumidity: number; // %
  userId: string;
  locationId: string;
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Plant {
  @Prop({ required: true })
      name: string;

  @Prop({ required: true })
      type: string;

  @Prop({ required: true })
      weeklyWaterNeed: number;

  @Prop({ required: true })
      expectedHumidity: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
      userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Location' })
      locationId: Types.ObjectId;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
