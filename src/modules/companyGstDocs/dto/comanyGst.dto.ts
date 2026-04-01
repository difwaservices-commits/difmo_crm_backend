import { IsString, IsOptional, Length } from 'class-validator';

export class CompanyDocsDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    gstNumber?: string;

    @IsOptional()
    @IsString()
    @Length(10, 10, { message: 'PAN must be exactly 10 characters' })
    panNumber?: string;

    @IsOptional()
    @IsString()
    accountName?: string;

    @IsOptional()
    @IsString()
    accountNumber?: string;

    @IsOptional()
    @IsString()
    ifscCode?: string;

    @IsOptional()
    @IsString()
    bankName?: string;

    @IsOptional()
    @IsString()
    branchName?: string;
}