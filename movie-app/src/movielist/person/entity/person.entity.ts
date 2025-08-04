import { BelongsToMany, Model } from "sequelize-typescript";
import { AutoIncrement, Column, DataType, Table } from "sequelize-typescript";
import { Movies } from "../../entity/movie.entity";
import { Personas } from "../../entity/persona.entity";

@Table({ tableName: 'persons', timestamps: true, paranoid: true })
export class Persons extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
   declare description: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
   declare dob: Date;

    @BelongsToMany(() => Movies, () => Personas)
    declare movies: Movies[];

}
