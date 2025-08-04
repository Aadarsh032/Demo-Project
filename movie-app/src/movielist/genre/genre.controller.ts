import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { MovielistService } from '../movielist.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { CreateGenreDto, UpdateGenreDto } from './dto/create-genre.dto';

import { FindOneGenreDto } from './dto/find-one-genre.dto';
import { GenreService } from './genre.service';
import { Genres } from './entity/genre.entity';

@Controller('movielist/genre')
export class GenreController {

    constructor(
        private readonly genreService: GenreService
    ) { }

    //Genre Controller
    //Get All Genre
    @Get()
    async getAllGenre() {
        try {
            return await this.genreService.getAllGenre();
        } catch (error) {
            throw new HttpException('Error Occured at Controller :', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //GetOne Genre
    @Get('find-one')
    async getOneGenre(@Query() findOneGenre: FindOneGenreDto) {
        try {
            return await this.genreService.getOneGenre(findOneGenre);
        } catch (error) {
            throw new HttpException(`Error Occured at Controller:`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Create one Genre
    @Post()
    async createOneGenre(@Body() createGenre: CreateGenreDto) {
        try {
            return await this.genreService.createOneGenre(createGenre);
        } catch (error) {
            throw new HttpException('Error Occured at Controller:', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Update One Genre
    @Patch(':id')
    async updateOneGenre(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
        try {
            return await this.genreService.updateOneGenre(Number(id), updateGenreDto);
        } catch (error) {
            throw new HttpException('Error Occured at Controller:', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Delete One Genre
    @Delete(':id')
    async deleteOneGenre(@Param('id') id: string) {
        try {
            return await this.genreService.deleteOneGenre(Number(id));
        } catch (error) {
            throw new HttpException('Error Occured at Controller', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
