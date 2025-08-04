import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Roles } from "./roles.entity";

@Table({tableName:'users', timestamps:true, paranoid:true})
export class Users extends Model{
    
    @Column({
        type: DataType.STRING,
        allowNull:false
    })
    name:string;

    @Column({
        type:DataType.STRING,
        allowNull:false,
        unique:true
    })
    email:string;

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    password:string;

    @ForeignKey(()=>Roles)
    @Column
    rolesId:number;


    @BelongsTo(()=> Roles)
    roles: Roles;

}