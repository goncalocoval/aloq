import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty({ message: 'Password must not be empty' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    newPassword: string;
}