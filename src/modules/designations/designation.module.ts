import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from './designation.entity';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';

import { AccessControlModule } from '../access-control/access-control.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Designation]),
        AccessControlModule
    ],
    providers: [DesignationService],
    controllers: [DesignationController],
    exports: [DesignationService],
})
export class DesignationModule { }
