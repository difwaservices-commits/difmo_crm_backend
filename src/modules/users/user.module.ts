import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Role } from '../access-control/role.entity';
import { Permission } from '../access-control/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
