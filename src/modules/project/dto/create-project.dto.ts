import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateProjectDto {

  @IsString()
  projectName: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsString()
  clientName: string;

  @IsString()
  contactInfo: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsString()
  phase?: string;

  @IsOptional()
  @IsDateString()
  assigningDate?: string;

  @IsOptional()
  @IsString()
  deploymentLink?: string;

  @IsOptional()
  @IsNumber()
  totalPayment?: number;

  @IsOptional()
  @IsNumber()
  paymentReceived?: number;

  @IsOptional()
  @IsString()
  assignedPeople?: string;
}
