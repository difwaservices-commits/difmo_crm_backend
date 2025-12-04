"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const company_module_1 = require("./modules/companies/company.module");
const user_module_1 = require("./modules/users/user.module");
const department_module_1 = require("./modules/departments/department.module");
const access_control_module_1 = require("./modules/access-control/access-control.module");
const company_entity_1 = require("./modules/companies/company.entity");
const user_entity_1 = require("./modules/users/user.entity");
const department_entity_1 = require("./modules/departments/department.entity");
const role_entity_1 = require("./modules/access-control/role.entity");
const permission_entity_1 = require("./modules/access-control/permission.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'db.sqlite',
                entities: [company_entity_1.Company, user_entity_1.User, department_entity_1.Department, role_entity_1.Role, permission_entity_1.Permission],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            company_module_1.CompanyModule,
            user_module_1.UserModule,
            department_module_1.DepartmentModule,
            access_control_module_1.AccessControlModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map