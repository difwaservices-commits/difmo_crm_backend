import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { AbilityFactory } from './ability.factory';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { AbilitiesGuard } from './abilities.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [AbilityFactory, AccessControlService, AbilitiesGuard],
  controllers: [AccessControlController],
  exports: [
    AbilityFactory,
    AccessControlService,
    AbilitiesGuard,
    TypeOrmModule,
  ],
})
export class AccessControlModule {}
