/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { MovielistService } from './movielist.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movies } from './entity/movie.entity';
import {  FindOneMovieDto } from './dto/find-one-movie.dto';
import { FindAllMovieDto } from './dto/find-all-movie.dto';


@Controller('movielist')
export class MovielistController {

    constructor(
        private readonly movieListService: MovielistService
    ) { }

    //Movies Controller

    // //Get All Movies Offset Pagination
    // @Get()
    // async getAllMovies(@Query('page') page :string, @Query('limit') limit :string) {
    //     try {
    //         return await this.movieListService.getAllMovie(Number(page), Number( limit));
    //     } catch (error) {
    //         throw new HttpException('Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }


    //Get All Movies KeySet Pagination
    @Get()
    async getAllMovies(@Query('page') page: string, @Query('limit') limit: string) {
        try {
            return await this.movieListService.getAllMovie(Number(page), Number(limit));
        } catch (error) {
            throw new HttpException('Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Get One Movie
    @Get('get-one')
    async getOneMovie(@Query() getOneMovie: FindOneMovieDto) {
        try {
            return await this.movieListService.getOneMovie(getOneMovie);
        } catch (error) {
            throw new HttpException('Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Get All Movies with genres and persons
    @Get('get-all')
    async findAllMoviesWithPersonGernes(@Query() getAllMovie: FindAllMovieDto) {
        return await this.movieListService.findAllMoviesWithGenrePersons(getAllMovie);
    }

    @Get('fts')
    async findMoviesWithTextSearch (@Query('q') query: string){
        return await this.movieListService.findMoviesWithTextSearch(query);
    }

    //Create one Movie
    @Post()
    async createOneMovie(@Body() createMoviesDto: CreateMovieDto) {
        try {
            return this.movieListService.createOneMovie(createMoviesDto);
        } catch (error) {
            throw new HttpException('Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Update One Movie
    @Patch()
    async updateOneMovie() {
        try {
            return this.movieListService.updateOneMovie();
        } catch (error) {
            throw new HttpException('Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    //Delete One Movie
    @Delete(':id')
    async deleteOneMovie(@Param('id') id: string) {
        try {
            return this.movieListService.deleteOneMovie(Number(id));
        } catch (error) {
            throw new HttpException('Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
