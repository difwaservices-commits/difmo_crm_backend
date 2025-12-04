import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.roles) return false;

        const userPermissions = user.roles.flatMap(role => role.permissions.map(p => p.action + ':' + p.resource));

        // Check if user has all required permissions (or maybe any? usually any for roles, all for permissions? let's assume any for now or match exact string)
        // Actually, let's assume requiredPermissions are strings like 'create:user'
        return requiredPermissions.some((permission) => userPermissions.includes(permission));
    }
}
