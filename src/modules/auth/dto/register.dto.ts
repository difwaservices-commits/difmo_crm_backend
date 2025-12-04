import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class RegisterDto {
    // Company Info
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsOptional()
    companyWebsite?: string;

    @IsString()
    @IsNotEmpty()
    industry: string;

    @IsString()
    @IsNotEmpty()
    companySize: string;

    @IsString()
    @IsOptional()
    logo?: string;

    @IsString()
    @IsNotEmpty()
    companyAddress: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    postalCode?: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    // Admin Account
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    // Configuration
    @IsString()
    @IsNotEmpty()
    timezone: string;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsArray()
    @IsOptional()
    workingDays?: string[];

    @IsString()
    @IsOptional()
    workingHoursStart?: string;

    @IsString()
    @IsOptional()
    workingHoursEnd?: string;

    @IsBoolean()
    @IsOptional()
    enableTimeTracking?: boolean;

    @IsBoolean()
    @IsOptional()
    enableScreenMonitoring?: boolean;

    @IsBoolean()
    @IsOptional()
    enablePayroll?: boolean;
}
