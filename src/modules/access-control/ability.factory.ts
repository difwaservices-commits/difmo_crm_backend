import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Role } from './role.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = any; // We can use 'any' or define specific entity types

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    // Check for Super Admin / Admin bypass
    const isAdmin = user.roles?.some((role) =>
      ['Super Admin', 'Admin'].includes(role.name),
    );
    if (isAdmin) {
      can(Action.Manage, 'all');
    }

    if (user.roles) {
      user.roles.forEach((role: Role) => {
        if (role.permissions) {
          role.permissions.forEach((permission) => {
            const action = permission.action as Action;
            const resource = permission.resource;

            if (permission.conditions) {
              // Parse and replace placeholders in conditions
              let conditionsStr = permission.conditions;

              // Simple template replacement for user attributes
              // e.g. ${user.id} -> user.id value
              if (conditionsStr.includes('${user.')) {
                const matches = conditionsStr.match(/\${user\.([^}]+)}/g);
                if (matches) {
                  matches.forEach((match) => {
                    const field = match.replace('${user.', '').replace('}', '');
                    const value = user[field];
                    conditionsStr = conditionsStr.replace(match, value);
                  });
                }
              }

              try {
                const conditions = JSON.parse(conditionsStr);
                can(action, resource, conditions);
              } catch (e) {
                console.error(
                  `Failed to parse conditions for permission ${permission.id}:`,
                  e,
                );
                // Fallback: if conditions fail to parse, don't grant permission or grant without conditions if preferred
              }
            } else {
              can(action, resource);
            }
          });
        }
      });
    }

    // Example hardcoded rules for Super Admins if any
    // if (user.isAdmin) {
    //   can(Action.Manage, 'all');
    // }

    return build({
      detectSubjectType: (item) => item.constructor,
    });
  }
}
