import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Get permissions from roles
    const rolePermissions = (user.roles || []).flatMap((role) =>
      (role.permissions || []).map((p) => p.action + ':' + p.resource),
    );

    // Get direct permissions
    const directPermissions = (user.permissions || []).map(
      (p) => p.action + ':' + p.resource,
    );

    // Merge all permissions
    const userPermissions = Array.from(
      new Set([...rolePermissions, ...directPermissions]),
    );

    // Check if user has all required permissions
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
