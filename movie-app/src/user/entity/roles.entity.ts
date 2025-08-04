import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";

import { RolesPermissions } from "./roles_permissions_join.entity";
import { Permissions } from "./permissions.entity";
import { Role } from "../constants/user.enum";
import { Users } from "./users.entity";

@Table({ tableName: 'roles', timestamps: true, paranoid: true })
export class Roles extends Model {

    @Column({
        type: DataType.ENUM(...Object.values(Role)),
        allowNull: false
    })
    name: Role;

    @HasOne(() => Users)
    users: Users;

    @BelongsToMany(() => Permissions, () => RolesPermissions)
    permissions: Permissions[];
}