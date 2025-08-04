import { ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateGenreDto, UpdateGenreDto } from "./dto/create-genre.dto";
import { FindOneGenreDto } from "./dto/find-one-genre.dto";
import { Attributes, CreationAttributes, WhereOptions } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { Genres } from "./entity/genre.entity";
import { GenreRepository } from "./genre.repository";
import { Persons } from "../person/entity/person.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';


@Injectable()
export class GenreService {

    constructor(

        private readonly genreRepository: GenreRepository
    ) { }

    //Genre Services

    //Get All Genre
    async getAllGenre() {
        try {
            return await this.genreRepository.findAll();
        }
        catch (error) {
            throw new Error('An unexpected Error occured while reading all Genre')
        }
    }

    //Get One Genre
    async getOneGenre(findOneGenre: FindOneGenreDto) {
        try {
            const whereParameters: WhereOptions = {
                ...(findOneGenre.id && { id: Number(findOneGenre.id) }),
                ...(findOneGenre.genre) && { genre: findOneGenre.genre }
            };
            const genres = await this.genreRepository.findOne(whereParameters);
            if (!genres) {
                throw new NotFoundException(`No Records Matching the Query `);
            }
            return genres;
        }
        catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new Error('An unexpected Error occured while reading all Genre');
        }
    }

    //Create One Genre
    async createOneGenre(createGenreDto: CreateGenreDto) {
        try {
            let whereParameters: WhereOptions = {
                ...(createGenreDto.genre) && { genre: createGenreDto.genre }
            };
            const existingGenre = await this.genreRepository.findOne(whereParameters);
            if (existingGenre) {
                throw new ConflictException(`Genre ${createGenreDto.genre} already exists.`)
            }
            let payload: CreationAttributes<Genres> = {
                genre: createGenreDto.genre,
                description: createGenreDto.description
            };
            return await this.genreRepository.createOne(payload);
        }
        catch (error) {
            if (error instanceof ConflictException) throw error;
            throw new Error('An unexpected Error occured while creating Genre');
        }
    }

    //Update One Genre
    async updateOneGenre(id: number, updateOneGenre: UpdateGenreDto) {
        try {
            var whereParameters: WhereOptions = {
                id: Number(id)
            };
            const existingGenreCheck = await this.genreRepository.findOne(whereParameters);
            if (!existingGenreCheck) {
                throw new NotFoundException(`Genre Id:${id} does not exists.`);
            }
            var whereParameters: WhereOptions = {
               ...(updateOneGenre.genre)&& {genre: updateOneGenre.genre}
            }
            const genreAlreadyExistsCheck = await this.genreRepository.findOne(whereParameters);
            if (genreAlreadyExistsCheck) {
                throw new ConflictException(`Genre ${updateOneGenre.genre} already exists.`)
            }

            const payload : Partial<Attributes<Genres>> ={
               ...(updateOneGenre.genre)&& {genre: updateOneGenre.genre},
                ...(updateOneGenre.description)&& {description: updateOneGenre.description}
            }
            return await this.genreRepository.updateOne(existingGenreCheck, payload);
        }
        catch (error) {
            if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
            throw new Error('An unexpected Error occured while updating Genre');
        }
    }

    //Delete One Genre
    async deleteOneGenre(id: number) {
        try {
            var whereParameters: WhereOptions = { id: id };
            const result = await this.genreRepository.deleteOne(whereParameters);
            if (!result) {
                throw new NotFoundException(`Genre by Id:${id} does not exists`);
            }
            return { body: `Succesfully deleted Genre Id:${id}` }
        }
        catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new Error('An unexpected Error occured while deleting Genre');
        }
    }
}