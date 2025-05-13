/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/user/dto/register.dto';
import { MailService } from 'src/mail/mail.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import generateToken from 'src/util/generateToken';

const clientId = process.env.CLIENT_ID;

@Injectable()
export class AuthService {
    private client = new OAuth2Client(clientId);

    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private userService: UserService,
    private mailService: MailService,
    ) {}

    async register(dto: RegisterDto): Promise<any> {
        const userExists = await this.userModel.findOne({ email: dto.email });
        if (userExists) {
            throw new ConflictException();
        }

        const token = generateToken();

        const newUserObj = {
            email: dto.email,
            full_name: dto.full_name,
            emailVerified: false,
            password: '',
            verificationToken: token,
        };

        if (dto.password?.length === 0 || dto.password?.length < 6) {
            throw new Error();
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword =
      dto?.password && (await bcrypt.hash(dto.password, salt));

        newUserObj.password = hashedPassword;

        const newUser = new this.userModel(newUserObj);

        await newUser.save();

        const url = process.env.FRONTEND_URL;

        const verifyLink = `${url}/verify-email?token=${token}&email=${newUser.email}`;

        await this.mailService.sendMail({
            to: newUser.email,
            subject: 'E-posta Doğrulama',
            html: `<p>Mail adresini doğrulamak için <a href="${verifyLink}">buraya tıkla</a>.</p>`,
        });

        return { message: 'User created successfully. Please check your e-mail.', userId: newUser._id };
    }

    async validateUser(
        email: string,
        password: string,
        jti: string | undefined,
    ): Promise<any> {
        email = email.trim();

        const user = (await this.userService.findByEmail(email)) as UserDocument;

        if (typeof jti === 'string' && jti.length > 0 && user) {
            const { password, ...result } = user.toObject();

            const access_token = this.jwtService.sign({
                email: user.email,
                sub: user._id,
            });
            return { ...result, access_token };
        }

        if (user && password && !user.password) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        if (
            user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
        ) {
            const { password, ...result } = user.toObject();

            const access_token = this.jwtService.sign({
                email: user.email,
                sub: user._id,
            });
            return { ...result, access_token };
        }
        return null;
    }

    login(user: UserDocument) {
        if (!user.emailVerified) {
            throw new BadRequestException('Please verify your email');
        }

        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
            ...user,
        };
    }
}
