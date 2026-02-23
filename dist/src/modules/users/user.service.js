"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const role_entity_1 = require("../access-control/role.entity");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    userRepository;
    roleRepository;
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    async create(createUserDto) {
        if (!createUserDto.password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const { companyId, ...userData } = createUserDto;
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            company: companyId ? { id: companyId } : undefined,
            isActive: true,
        });
        await this.userRepository.save(user);
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            relations: ['company', 'roles', 'roles.permissions'],
        });
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['company', 'roles', 'roles.permissions'],
        });
    }
    async update(id, data) {
        const user = await this.findById(id);
        if (!user)
            throw new Error('User not found');
        Object.assign(user, data);
        return this.userRepository.save(user);
    }
    async saveUser(user) {
        return this.userRepository.save(user);
    }
    async updateProfile(userId, data) {
        console.log("aerxtcyvubinim", data);
        const user = await this.findById(userId);
        if (!user)
            throw new Error('User not found');
        delete data.password;
        delete data.roles;
        delete data.company;
        if (data.email && data.email !== user.email) {
            const existing = await this.findByEmail(data.email);
            if (existing)
                throw new Error('Email already exists');
        }
        Object.assign(user, data);
        return this.userRepository.save(user);
    }
    async findRolesByIds(ids) {
        return this.roleRepository.find({ where: { id: (0, typeorm_2.In)(ids) } });
    }
    async assignRole(userId, roleName) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
        if (!user)
            throw new Error('User not found');
        let role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            role = this.roleRepository.create({
                name: roleName,
                description: `Default ${roleName} role`,
            });
            await this.roleRepository.save(role);
        }
        const hasRole = user.roles?.some((r) => r.id === role.id);
        if (!hasRole) {
            if (!user.roles)
                user.roles = [];
            user.roles.push(role);
            await this.userRepository.save(user);
        }
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map