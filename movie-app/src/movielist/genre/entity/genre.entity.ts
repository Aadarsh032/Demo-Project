

import { MovieGenresType } from "src/movielist/constants/movielist.enums";
import { AutoIncrement, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Movies } from "src/movielist/entity/movie.entity";
import { MoviesGenres } from "src/movielist/entity/movie-genre-join.entity";


@Table({ tableName: 'genres', timestamps: true , paranoid: true })
export class Genres extends Model {

    @Column({
        type: DataType.ENUM(...Object.values(MovieGenresType)),
        allowNull: false,
        unique:true
    })
    genre: MovieGenresType;

     @Column({
        type: DataType.STRING,
        allowNull: false
    })
    description: string;

    @BelongsToMany(() => Movies, ()=> MoviesGenres)
    movies: Movies[];
}