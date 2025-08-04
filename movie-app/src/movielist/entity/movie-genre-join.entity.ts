import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Movies } from "./movie.entity";
import { Genres } from "../genre/entity/genre.entity";


@Table({ tableName: 'movies_genres_join', timestamps: true ,paranoid:true })
export class MoviesGenres extends Model {
    @ForeignKey(() => Movies)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
   declare movieId: number;

    @ForeignKey(() => Genres)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare genreId: number;
}