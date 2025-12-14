import { IsString, IsEmail, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    website?: string;

    @IsString()
    @IsOptional()
    industry?: string;

    @IsString()
    @IsOptional()
    size?: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    openingTime?: string;

    @IsString()
    @IsOptional()
    closingTime?: string;
}
