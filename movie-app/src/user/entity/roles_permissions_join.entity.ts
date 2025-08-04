import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Permissions } from "./permissions.entity";
import { Roles } from "./roles.entity";

@Table({tableName:'roles_permissions_join', timestamps:true , paranoid: true})
export class RolesPermissions extends Model{
    
  @ForeignKey(()=> Roles)
  @Column
  roleId: number;

  @ForeignKey(()=> Permissions)
  @Column
  permissionId:number;
    
}