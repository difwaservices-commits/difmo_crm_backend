import { Employee } from '../employees/employee.entity';
export declare class Attendance {
    id: string;
    employee: Employee;
    employeeId: string;
    date: Date;
    checkInTime: string;
    checkOutTime: string;
    status: string;
    workHours: number;
    overtime: number;
    notes: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}
