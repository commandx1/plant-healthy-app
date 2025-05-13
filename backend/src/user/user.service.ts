import { BadRequestException,Injectable,NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RegisterDto } from 'src/user/dto/register.dto'

import { User,UserDocument,IUser } from './schemas/user.schema'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async createUser(user: RegisterDto): Promise<User> {
        return this.userModel.create(user)
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec()
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec()
    }

    async findUserById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec()
    }

    async update(id: string,newUser: IUser): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id,newUser,{ new: true }).exec()
    }

    async verifyEmail(token: string,email: string): Promise<{ user?: { emailVerified: boolean }; message?: string }> {
        if (!token) throw new BadRequestException('Missing token')

        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (user.emailVerified) {
            return { message: 'You have already verified your email. Please log in.',user: { emailVerified: true } }
        }

        if (user.verificationToken !== token) {
            throw new BadRequestException('Invalid token')
        }

        user.emailVerified = true
        user.verificationToken = ''
        await user.save()
        return { user: { emailVerified: true },message: 'E-mail verified successfully. Please log in.' }
    }


    async remove(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec()
    }
}
