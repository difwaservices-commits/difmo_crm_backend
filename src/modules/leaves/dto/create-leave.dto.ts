import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateLeaveDto {
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

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class UpdateLeaveStatusDto {
  @IsNotEmpty()
  @IsEnum(['pending', 'approved', 'rejected'])
  status: string;
}
