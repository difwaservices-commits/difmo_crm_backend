import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsArray,
  IsEnum,
} from 'class-validator';

// Defining Enums to match your logic exactly
export enum EmployeeBranch {
  NEW_YORK = 'New York',
  WASHINGTON = 'Washington',
  HEADQUARTER = 'Headquarter',
  SINGAPUR = 'Singapur',
  REMOTE = 'Remote',
}

export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT_BASE = 'contract-base',
  INTERN = 'intern',
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  INACTIVE = 'In-Active',
  ON_LEAVE = 'On-Leave',
  Terminate = 'Terminated',
}

export class CreateEmployeeDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  employeeId?:String;

  @IsString()
  role: string;

  @IsDateString()
  hireDate: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsString()
  @IsOptional()
  manager?: string;

  @IsEnum(EmployeeBranch)
  @IsOptional()
  branch?: EmployeeBranch;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  // Logic: Added to support your EmployeeService role assignment
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[];
}

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsString()
  @IsOptional()
  manager?: string;

  @IsEnum(EmployeeBranch)
  @IsOptional()
  branch?: EmployeeBranch;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

   @IsEnum(EmployeeStatus)
   @IsOptional()
  status?: EmployeeStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[];
}
