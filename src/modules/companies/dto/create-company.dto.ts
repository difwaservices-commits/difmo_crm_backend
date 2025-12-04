import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}
