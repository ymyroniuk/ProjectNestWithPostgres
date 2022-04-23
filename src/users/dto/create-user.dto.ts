import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'y@gmail.com', description: 'User email'})
    @IsString({ message: 'Must have string'})
    @IsEmail({}, { message: 'Wrong email' })
    readonly email: string;
    @ApiProperty({ example: '113', description: 'User password'})
    @IsString({ message: 'Must have string'})
    @Length(4, 16, { message: 'No less than 4 and no more than 16 characters'})
    readonly password: string;
}