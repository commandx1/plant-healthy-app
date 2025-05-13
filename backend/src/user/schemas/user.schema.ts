import { Prop,Schema,SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

export interface IUser {
    _id: string
    access_token: string
    createdAt: string
    email: string
    full_name: string
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
        email: string

    @Prop()
        password?: string

    @Prop({ required: true })
        full_name: string

    @Prop()
        verificationToken: string

    @Prop({ default: false })
        emailVerified: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
