import { ForeignKey, Model } from "sequelize-typescript";
import { AutoIncrement, Column, DataType, Table } from "sequelize-typescript";
import { Persons } from "../person/entity/person.entity";
import { Movies } from "./movie.entity";
import { Cast } from "../constants/movielist.enums";


@Table({ tableName: 'personas', timestamps: true, paranoid: true })
export class Personas extends Model {

    @ForeignKey(() => Persons)
    @Column({
        type: DataType.INTEGER,
    })
    declare personId: number;

    @ForeignKey(() => Movies)
    @Column({
        type: DataType.INTEGER,
    })
   declare movieId: number;

    @Column({
        type: DataType.ENUM(...Object.values(Cast)),
        allowNull: false,
    })
    declare cast: Cast;
}


