/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto, UpdateOneMovieDto } from './dto/create-movie.dto';
import { CreateGenreDto, UpdateGenreDto } from './genre/dto/create-genre.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { Movies } from './entity/movie.entity';
import {
  FindOneGenreDto,
  FindOrCreateGenreDto,
} from './genre/dto/find-one-genre.dto';
import { CreationAttributes, WhereOptions } from 'sequelize';
import { MovieListRepository } from './movielist.repository';
import { GenreRepository } from './genre/genre.repository';
import { PersonRepository } from './person/person.repository';
import { Genres } from './genre/entity/genre.entity';
import { Persons } from './person/entity/person.entity';
import { MoviePersonDto } from './dto/movie-person.dto';
import { CreateMoviePayload, UpdateMoviePayload } from './constants/movie-payload.interface';
import { FindOrCreatePersonDto } from './person/dto/find-one-person';
import { FindOneMovieDto } from './dto/find-one-movie.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindAllMovieDto } from './dto/find-all-movie.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MovieQueue } from 'src/queue/movie.queue';
// import { MovieIndexQueue } from 'src/queue/movie-index.queue';

@Injectable()
export class MovielistService {
  private readonly logger = new Logger(MovielistService.name);
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @Inject('MOVIE-REPO')
    private readonly movieRepo: typeof Movies,
    private readonly movielistRepository: MovieListRepository,
    private readonly genreRepository: GenreRepository,
    private readonly personRepository: PersonRepository,
    private readonly elasticSearchService: ElasticsearchService,
    // private readonly movieIndexQueue: MovieIndexQueue
    private readonly movieQueue: MovieQueue
  ) { }

  //Movies Services
  //Create One Movie
  async createOneMovie(createMoviesDto: CreateMovieDto) {
    try {
      const newMovie = await this.sequelize.transaction(async (manager: Transaction) => {
        const { title, description, releaseDate, genres, persons } =
          createMoviesDto;

        // Check if Movie title is unique or not
        const whereParameters: WhereOptions = {
          title: title.toLowerCase(),
        };
        const existingMovieCheck =
          await this.movielistRepository.findOne(whereParameters);
        if (existingMovieCheck) {
          throw new ConflictException(
            `Movie Title: ${title} already exists. Cannot add another`,
          );
        }

        // Check if the ids provided in the genres and persons exixts or not
        // Check and Add the Genre to variable
        const moviesRelatedToGenre: Genres[] = [];
        for (const genre of genres) {
          const [genreInstance, _created] =
            await this.genreRepository.findOneorCreate(genre, manager);
          if (!genreInstance) {
            throw new NotFoundException(`Genre Id: ${genre} does not exists`);
          } else {
            moviesRelatedToGenre.push(genreInstance);
          }
        }

        // Check and Add the Genre to variable
        const personsRelatedToGenre: FindOrCreatePersonDto[] = [];
        for (const person of persons) {
          const [personInstance, _created] =
            await this.personRepository.findOneOrCreate(person, manager);
          if (!personInstance) {
            throw new NotFoundException(
              `Person Id: ${person.id} does not exists`,
            );
          } else {
            personsRelatedToGenre.push({
              id: personInstance.id,
              cast: person.cast,
            });
          }
        }
        // Create an instance and save it
        const payload: CreateMoviePayload = {
          title: title.toLowerCase(),
          description: description,
          release_date: releaseDate,
          genres: moviesRelatedToGenre,
          persons: personsRelatedToGenre,
        };
        const newMovie = await this.movielistRepository.createOne(
          payload,
          manager,
        );
        return newMovie;
      });

      await this.movieQueue.addMovieJob(newMovie.id);
      return newMovie;
    } catch (error) { 
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new Error('An unexpected Error occured while creating Movie');
    }
  }


  //Update One Movie
  async updateOneMovie(id: number, updateMovieDto: UpdateOneMovieDto) {
    try {
      const updatedMovie = await this.sequelize.transaction(async (manager: Transaction) => {
        var where: WhereOptions = {};
        where.id = id;

        const result = await this.movielistRepository.findOneByPkIncludedAssociation(id);
        if (!result) throw new NotFoundException('Movie not found');

        console.log("Result", result);

        var whereTitle: WhereOptions = {};
        if (updateMovieDto.title) {
          whereTitle.title = updateMovieDto.title.toLowerCase();
          console.log("Where Options", whereTitle);
          const existingMovieCheck = await this.movielistRepository.findOne(whereTitle);
          if (existingMovieCheck) {
            throw new ConflictException(
              `Movie Title: ${updateMovieDto.title} already exists. Cannot add another`,
            );
          }
        }


        if (updateMovieDto.title) where.title = updateMovieDto.title.toLowerCase();
        if (updateMovieDto.description) where.description = updateMovieDto.description;
        if (updateMovieDto.releaseDate) where.release_date = updateMovieDto.releaseDate;


        // Check if the ids provided in the genres and persons exixts or not
        // Check and Add the Genre to variable
        const moviesRelatedToGenre: Genres[] = [];
        for (const genre of updateMovieDto.genres || []) {
          const [genreInstance, _created] =
            await this.genreRepository.findOneorCreate(genre, manager);
          if (!genreInstance) {
            throw new NotFoundException(`Genre Id: ${genre} does not exists`);
          } else {
            moviesRelatedToGenre.push(genreInstance);
          }
        }

        // Check and Add the Genre to variable
        const personsRelatedToGenre: FindOrCreatePersonDto[] = [];
        for (const person of updateMovieDto.persons || []) {
          const [personInstance, _created] =
            await this.personRepository.findOneOrCreate(person, manager);
          if (!personInstance) {
            throw new NotFoundException(
              `Person Id: ${person.id} does not exists`,
            );
          } else {
            personsRelatedToGenre.push({
              id: personInstance.id,
              cast: person.cast,
            });
          }
        }
        // Create an instance and save it
        const payload: UpdateMoviePayload = {
          title: where.title.toLowerCase(),
          description: where.description,
          release_date: where.releaseDate,
          genres: moviesRelatedToGenre,
          persons: personsRelatedToGenre,
        };
        const updatedMovie = await this.movielistRepository.updateOne(
          result,
          payload,
          manager,
        );

//         const current = await this.elasticSearchService.get({
//   index: 'movies',
//   id: movieId.toString(),
// });

        return updatedMovie;
      })



      return updatedMovie;
    } catch (error) {
      this.logger.error('An unexpected Error occured while updating Movie', error);
      throw error;
    }
  }

  //Get One Movie
  // movie-list.service.ts

  async getOneMovie(dto: FindOneMovieDto): Promise<Movies | null> {
    try {
      let cacheKey = '';

      if (dto.title) {
        const key = dto.title.toLowerCase();
        cacheKey = `movie:${key}`;
      } else if (dto.persons) {
        cacheKey = `movie:${dto.persons}`;
      } else {
        cacheKey = `movie:${dto.genre}`;
      }

      const cached = await this.cacheManager.get<string>(cacheKey);

      if (cached) {
        const { data, cachedAt } = JSON.parse(cached);
        console.log(`${cacheKey} From Cache: ${cachedAt}`);
        return data;
      }

      const where: WhereOptions = {};
      if (dto.id) where.id = dto.id;
      if (dto.title) where.title = dto.title.toLowerCase();
      if (dto.description) where.description = dto.description;
      if (dto.release_date) where.release_date = dto.release_date;

      const include: any[] = [];

      if (dto.genre?.length) {
        include.push({
          association: 'genres',
          where: {
            genre: dto.genre,
          },
          required: true,
          through: { attributes: [] },
        });
      }

      if (dto.persons?.length) {
        include.push({
          association: 'persons',
          where: {
            name: dto.persons.map((name) => name.toLowerCase()),
          },
          required: true,
          through: { attributes: [] },
        });
      }
      const movie = await this.movielistRepository.findOneWithInclude(
        where,
        include,
      );

      const payload = {
        data: movie,
        cachedAt: new Date().toISOString(),
      };
      await this.cacheManager.set(cacheKey, JSON.stringify(payload), {
        ttl: 60,
      } as any);
      console.log(`${cacheKey} Not Cache — Fetched and Cached`);
      return movie;
    } catch (error) {
      throw new Error(`Failed to fetch movie: ${error.message}`);
    }
  }


  // Range Based KeySet Pagination Movies List
  async getAllMovie(page: number, limit: number) {
    try {
      const startId = (page - 1) * limit + 1;
      const cacheKey = `movie:all:page=${page}:limit=${limit}`;
      const cached = await this.cacheManager.get<string>(cacheKey);

      if (cached) {
        const { data, cachedAt } = JSON.parse(cached);
        console.log(`Movies From Cache: page:${page}:${cachedAt}`);
        return data;
      }

      const movies = await this.movielistRepository.findAllPaginated(
        startId,
        limit,
      );
      const { rows: limitedMovies, count: totalMovies } =
        await this.movielistRepository.findAndCountAll(limit, limit);
      const payload = {
        data: {
          limit,
          page,
          movies,
          total: totalMovies,
        },
        cachedAt: new Date().toISOString(),
      };
      await this.cacheManager.set(cacheKey, JSON.stringify(payload), {
        ttl: 60 * 5,
      } as any);
      console.log(`Movies Not Cache : page:${page} — Fetched and Cached`);
      return payload.data;
    } catch (error) {
      this.logger.error(
        'An unexpected error occurred while getting Movies',
        error,
      );
      throw error;
    }
  }



  async deleteOneMovie(id: number) {
    try {
      return await this.sequelize.transaction(async (manager: Transaction) => {
        const movieId: number = id;
        const result = await this.movielistRepository.deleteOne(
          movieId,
          manager,
        );
        if (!result) {
          throw new NotFoundException(`Movie by Id:${id} does not exists`);
        }
        return { body: `Succesfully deleted Movie Id:${id}` };
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllMoviesWithGenrePersons(dto: FindAllMovieDto) {

    var redisCacheKey = '';
    if (dto.genre) {
      redisCacheKey = redisCacheKey + `genre=${dto.genre}`;
    }
    if (dto.person) {
      redisCacheKey = redisCacheKey + `person=${dto.person}`;
    }
    if (dto.title) {
      redisCacheKey = redisCacheKey + `title=${dto.title}`;
    }

    const cacheKey = `movie:all:${redisCacheKey}:page=${dto.page}:limit=${dto.limit}`;
    const cached = await this.cacheManager.get<string>(cacheKey);

    if (cached) {
      const { result, cachedAt } = JSON.parse(cached);
      console.log(`Movies From Cache: page:${dto.page}:${cachedAt}`);
      return result;
    }

    const offset = (Number(dto.page) - 1) * Number(dto.limit);
    const result = await this.movielistRepository.findAllWithInclude(
      offset,
      dto.limit,
      dto.genre,
      dto.person,
    );
    const payload = {
      result,
      cachedAt: new Date().toISOString(),
    };
    await this.cacheManager.set(cacheKey, JSON.stringify(payload), {
      ttl: 60 * 5,
    } as any);
    console.log(`Movies Not Cache : page:${dto.page} — Fetched and Cached`);

    return payload.result;
  }


  async findMoviesWithTextSearch(query: string) {
    console.log("Query", query);
    const res = await this.movielistRepository.findAllWithTextSearch(query);
    return res;
  }


  // Original Get All Movies
  // async getAllMovie() {
  //     try {
  //         const cacheKey = 'movie:all';
  //         const cached = await this.cacheManager.get<string>(cacheKey);

  //         if (cached) {
  //             const { data, cachedAt } = JSON.parse(cached);
  //             console.log(`All Movies From Cache: ${cachedAt}`);
  //             return data;
  //         }

  //         const movies = await this.movielistRepository.findAll();
  //         const payload = {
  //             data: movies,
  //             cachedAt: new Date().toISOString(),
  //         };
  //         await this.cacheManager.set(cacheKey, JSON.stringify(payload), { ttl: 60 } as any);
  //         console.log(`All Movies Not Cache — Fetched and Cached`);
  //         return movies;
  //     } catch (error) {
  //         this.logger.error('An unexpected error occurred while getting Movies', error);
  //         throw error;
  //     }
  // }

  // //Paginated All Movies List
  // async getAllMovie(page: number, limit: number) {
  //     try {
  //         const offset = (page - 1) * limit;
  //         const cacheKey = `movie:all:page=${page}:limit=${limit}`;
  //         const cached = await this.cacheManager.get<string>(cacheKey);

  //         if (cached) {
  //             const { data, cachedAt } = JSON.parse(cached);
  //             console.log(`Movies From Cache: page:${page}:${cachedAt}`);
  //             return data;
  //         }

  //         const { rows: movies, count: total } = await this.movielistRepository.findAndCountAll(limit, offset);
  //         const payload = {
  //             data: {
  //                 total,
  //                 page,
  //                 limit,
  //                 totalpages: Math.ceil(total / limit),
  //                 movies
  //             },
  //             cachedAt: new Date().toISOString(),
  //         };
  //         await this.cacheManager.set(cacheKey, JSON.stringify(payload), { ttl: 60 * 5 } as any);
  //         console.log(`Movies Not Cache : page:${page} — Fetched and Cached`);
  //         return { movies, total };
  //     } catch (error) {
  //         this.logger.error('An unexpected error occurred while getting Movies', error);
  //         throw error;
  //     }
  // }


  async findAllInclude2() {
    return await this.movielistRepository.findAllInclude2();
  }


  // Service for Nest Js Elastic Search
  async getMoviesByGenre(genre: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const query = genre
      ? { match: { genres: genre } }
      : { match_all: {} };

    const hits: any = await this.movielistRepository.findAllByGenre(query, from, limit)
    return {
      total: hits.total.value,
      results: hits.hits.map(hit => hit._source),
    };
  }

  //Search By Query
  async searchMoviesByQuery(queryText: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const hits = await this.movielistRepository.findAllByQuery(queryText, from, limit);
    return hits;
  }





  // Migrating Postgres Data to Elastic


  // async buildMovieDocument(movieId: number) {
  //   const movie = await this.movieRepo.findByPk(movieId, {
  //     include: [
  //       {
  //         model: Genres,
  //         through: { attributes: [] }
  //       },
  //       {
  //         model: Persons,
  //         through: { attributes: ['cast'] }
  //       }
  //     ],
  //   })

  //   const movieDoc = {
  //     id: movie?.id,
  //     title: movie?.title,
  //     description: movie?.description,
  //     genres: movie?.genres?.map((g) => {
  //       return g.dataValues.genre
  //     }),
  //     persons: movie?.persons.map((p) => {
  //       const persona = (p as any).Personas;
  //       return {
  //         name: p.name,
  //         cast: persona.cast
  //       }
  //     })
  //   }
  //   return movieDoc;
  // }

  // async migrateAllMoviesToElastic() {
  //   let offset = 0;
  //   let hasMore = true;
  //   let BATCH_SIZE = 2000;

  //   while (hasMore) {
  //     const movies = await this.movieRepo.findAll({
  //       offset,
  //       limit: BATCH_SIZE,
  //       order: [['id', 'ASC']],
  //       include: [{
  //         model: Genres,
  //         through: { attributes: [] },
  //       },
  //       {
  //         model: Persons,
  //         through: {
  //           attributes: ['cast']
  //         }
  //       }],
  //     });

  //     const bulkMovie: any = [];

  //     for (const movie of movies) {
  //       const movieDoc = {
  //         id: movie.id,
  //         title: movie.title,
  //         description: movie.description,
  //         genres: movie.genres.map((g) => g.dataValues.genre),
  //         persons: movie.persons.map((p) => ({
  //           name: p.name,
  //           cast: (p as any).Personas.cast,
  //         })),
  //       };

  //       bulkMovie.push({ index: { _index: 'movies', _id: movieDoc.id } });
  //       bulkMovie.push(movieDoc);
  //     }

  //     if (bulkMovie.length > 0) {
  //       await this.bulkIndex(bulkMovie);
  //       console.log(`✅ Indexed batch starting from offset ${offset}`);
  //     }


  //     offset += BATCH_SIZE;
  //     hasMore = movies.length === BATCH_SIZE;
  //   }
  //   console.log('🎉 All movies migrated to Elasticsearch!');
  // }

  // async bulkIndex(body: any[]) {
  //   await this.elasticSearchService.bulk({ body, refresh: true });
  // }


}
