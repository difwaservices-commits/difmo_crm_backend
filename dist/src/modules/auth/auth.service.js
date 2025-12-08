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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const company_service_1 = require("../companies/company.service");
const user_service_1 = require("../users/user.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    companyService;
    userService;
    jwtService;
    constructor(companyService, userService, jwtService) {
        this.companyService = companyService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.email, sub: user.id, companyId: user.company?.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
    async register(data) {
        console.log('Registering with data:', JSON.stringify(data));
        try {
            const company = await this.companyService.create({
                name: data.companyName,
                website: data.companyWebsite,
                industry: data.industry,
                size: data.companySize,
                logo: data.logo,
                email: data.companyEmail || data.email,
                address: data.companyAddress,
                city: data.city,
                postalCode: data.postalCode,
                country: data.country,
                timezone: data.timezone,
                currency: data.currency,
                workingDays: data.workingDays,
                workingHoursStart: data.workingHoursStart,
                workingHoursEnd: data.workingHoursEnd,
                enableTimeTracking: data.enableTimeTracking,
                enableScreenMonitoring: data.enableScreenMonitoring,
                enablePayroll: data.enablePayroll,
            });
            const user = await this.userService.create({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                companyId: company.id,
                isActive: true
            });
            return { company, user };
        }
        catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [company_service_1.CompanyService,
        user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map