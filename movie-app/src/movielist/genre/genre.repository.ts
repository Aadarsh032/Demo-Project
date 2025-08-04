import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { Genres } from "./entity/genre.entity";
import { FindOneGenreDto, FindOrCreateGenreDto } from "./dto/find-one-genre.dto";
import { Attributes, CreationAttributes, Transaction, WhereOptions } from "sequelize";
import { MovieGenresType } from "../constants/movielist.enums";
import { UpdateGenreDto } from "./dto/create-genre.dto";

export class GenreRepository {

    constructor(
        @Inject('GENRE-REPO')
        private genreRepo: typeof Genres,
    ) { }
    //Genere Repository
    //Find All Genre
    async findAll() {
        try {
            const genres = await this.genreRepo.findAll();
            return genres;
        } catch (error) {
            throw error;
        }
    }


    //Find One Genre
    async findOne(whereParameters: WhereOptions) {
        try {
            return await this.genreRepo.findOne({ where: whereParameters });
        } catch (error) {
            throw error;
        }
    }

    //Create One Genre
    async createOne(payload: CreationAttributes<Genres>) {
        try {
            const genre = await this.genreRepo.create(payload);
            return genre;
        } catch (error) {
            throw error;
        }
    }

    //Update One Genre
    async updateOne(existingGenre: Genres, payload: Partial<Attributes<Genres>>) {
        try {
            await existingGenre.update({
                genre: payload.genre,
                description: payload.description
            })
            return await existingGenre.save();
        } catch (error) {
            throw error;
        }
    }

    // Delete One Genre
    async deleteOne(whereParameters: WhereOptions) {
        try {
            return await this.genreRepo.destroy({ where: whereParameters });
        } catch (error) {
            throw error;
        }
    }


    //Find One Or Create Genre
    async findOneorCreate(genre: FindOrCreateGenreDto, manager?: Transaction) {
        return await this.genreRepo.findOrCreate({
            where: { genre: genre.genre },
            transaction: manager,
            defaults: {
                description: genre.description || '',
            },
        });
    }
}