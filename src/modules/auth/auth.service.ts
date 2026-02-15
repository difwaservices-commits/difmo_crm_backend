import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from '../companies/company.service';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(
        private companyService: CompanyService,
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, companyId: user.company?.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    async register(data: any) {
        console.log('Registering with data:', JSON.stringify(data));
        try {
            // 1. Create Company
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

            // 2. Create Admin User
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
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    }
}
