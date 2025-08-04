
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Action } from "../constants/user.enum";
import { RolesPermissions } from "./roles_permissions_join.entity";
import { Roles } from "./roles.entity";


@Table({ tableName: 'permissions', timestamps: true, paranoid: true })
export class Permissions extends Model {

    @Column({
        type: DataType.ENUM(...Object.values(Action)),
        allowNull: false
    })
    action: Action;

    @BelongsToMany(() => Roles, () => RolesPermissions)
    roles: Roles[];
}
