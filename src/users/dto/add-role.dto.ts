import { IsString, IsNumber } from 'class-validator';

export class AddRoleDto {
    @IsString({ message: 'Must have string'})
    readonly value: string;
    @IsNumber({}, { message: 'Must have number'})
    readonly userId: number;
}