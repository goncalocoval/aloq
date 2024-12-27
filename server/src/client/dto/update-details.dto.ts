import { IsString, MaxLength } from 'class-validator';

export class UpdateDetailsDto {
    @IsString()
    @MaxLength(200, { message: 'Details cannot exceed 200 characters' })
    details: string;
}