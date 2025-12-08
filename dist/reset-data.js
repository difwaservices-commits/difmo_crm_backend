"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./src/modules/employees/employee.entity");
const attendance_entity_1 = require("./src/modules/attendance/attendance.entity");
const user_entity_1 = require("./src/modules/users/user.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [employee_entity_1.Employee, attendance_entity_1.Attendance, user_entity_1.User],
    synchronize: false,
});
async function resetData() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        console.log('Deleting Attendance records...');
        await queryRunner.query('DELETE FROM attendance');
        console.log('Deleting Employee records...');
        await queryRunner.query('DELETE FROM employee');
        console.log('Data reset successful');
        await AppDataSource.destroy();
    }
    catch (error) {
        console.error('Error resetting data:', error);
        process.exit(1);
    }
}
resetData();
//# sourceMappingURL=reset-data.js.map