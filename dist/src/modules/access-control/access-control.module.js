"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_entity_1 = require("./role.entity");
const permission_entity_1 = require("./permission.entity");
const ability_factory_1 = require("./ability.factory");
const access_control_service_1 = require("./access-control.service");
const access_control_controller_1 = require("./access-control.controller");
const abilities_guard_1 = require("./abilities.guard");
let AccessControlModule = class AccessControlModule {
};
exports.AccessControlModule = AccessControlModule;
exports.AccessControlModule = AccessControlModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role, permission_entity_1.Permission])],
        providers: [ability_factory_1.AbilityFactory, access_control_service_1.AccessControlService, abilities_guard_1.AbilitiesGuard],
        controllers: [access_control_controller_1.AccessControlController],
        exports: [
            ability_factory_1.AbilityFactory,
            access_control_service_1.AccessControlService,
            abilities_guard_1.AbilitiesGuard,
            typeorm_1.TypeOrmModule,
        ],
    })
], AccessControlModule);
//# sourceMappingURL=access-control.module.js.map