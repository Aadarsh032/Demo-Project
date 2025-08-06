/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, Patch, Post, Query } from '@nestjs/common';
import { MovielistService } from './movielist.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movies } from './entity/movie.entity';
import { FindOneMovieDto } from './dto/find-one-movie.dto';
import { FindAllMovieDto } from './dto/find-all-movie.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';


@Controller('movielist')
export class MovielistController {

    constructor(
        private readonly movieListService: MovielistService,
        private readonly elasticSearchService: ElasticsearchService
    ) { }


    @Delete('delete-elastic-index')
    async deleteMovieIndex() {
        try {
            console.log("🟡 Deleting index...");
            const result = await this.elasticSearchService.indices.delete({ index: 'movies' });
            console.log('✅ Deleted movies index');
            return {
                message: 'Index deleted successfully',
                elasticResult: result,
            };
        } catch (error) {
            if (error.meta?.body?.error?.type === 'index_not_found_exception') {
                console.warn('⚠️ Index not found');
                return {
                    message: 'Index not found (already deleted)',
                };
            } else {
                console.error('❌ Failed to delete index:', error);
                throw new InternalServerErrorException('Failed to delete index');
            }
        }
    }


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
    async findMoviesWithTextSearch(@Query('q') query: string) {
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

    @Get('included')
    async findAllInclude2() {
        return await this.movieListService.findAllInclude2();
    }


    @Post('elastic-create')
    async indexMovie(@Body() movie: { id: number; title: string; description: string }) {
        console.log("elastic search");
        const mov = {
            "id": 1,
            "title": "The Godfather",
            "description": "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
            "releaseYear": 1972,
            "genres": ["Crime", "Drama"],
            "cast": ["Francis Ford Coppola", "Marlon Brando", "Al Pacino"],
        }
        return await this.elasticSearchService.index({
            index: 'demo-movies',
            id: mov.id.toString(),
            document: mov,
        });
    }

    @Get('elastic-search/genre')
    async searchMovie(@Query('genre') genre: string, @Query('page')page: number, @Query('limit')limit: number) {
        return await this.movieListService.getMoviesByGenre(genre, Number(page), Number(limit));
    }

    @Get('movie-id/:id')
    async buildMovieDoc(@Param('id') id: number) {
        return await this.movieListService.buildMovieDocument(id);
    }

    @Post('migrate-to-elastic')
    async migrateToELastic() {
        await this.movieListService.migrateAllMoviesToElastic();
        return { message: 'Migration started!' };

    }


}
