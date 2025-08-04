import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './entity/users.entity';
import { Roles } from './entity/roles.entity';
import { Permissions } from './entity/permissions.entity';
import { RolesPermissions } from './entity/roles_permissions_join.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
