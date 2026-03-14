import { IsEnum } from 'class-validator';
import { EmployeeStatus } from './employee.dto';


export class UpdateEmployeeStatusDto {
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;
}