import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateWFHRequestDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class UpdateWFHRequestStatusDto {
  @IsNotEmpty()
  @IsEnum(['APPROVED', 'REJECTED'])
  status: string;

  @IsOptional()
  @IsString()
  adminComment?: string;
}
