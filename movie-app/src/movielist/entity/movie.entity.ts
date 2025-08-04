import { BelongsToMany, ForeignKey, Model, Table } from "sequelize-typescript";
import { AutoIncrement, Column, DataType, } from "sequelize-typescript";

import { MoviesGenres } from "./movie-genre-join.entity";
import { Personas } from "./persona.entity";
import { Persons } from "../person/entity/person.entity";
import { Genres } from "../genre/entity/genre.entity";


@Table({ tableName: 'movies', timestamps: true, paranoid: true })
export class Movies extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.STRING
    })
    declare description: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare release_date: Date;

    @BelongsToMany(() => Genres, () => MoviesGenres)
    declare genres: Genres[];

    @BelongsToMany(() => Persons, () => Personas)
    declare persons: Persons[];

}


