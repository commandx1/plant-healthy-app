import { IsEmail,IsNotEmpty,IsString } from 'class-validator'

export class RegisterDto {
    @IsEmail()
        email: string

    @IsString()
    @IsNotEmpty({ message: 'Password could not be empty' })
        password: string

    @IsNotEmpty()
        full_name: string
}
