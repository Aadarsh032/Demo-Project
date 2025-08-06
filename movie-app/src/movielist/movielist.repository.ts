import { Inject } from '@nestjs/common';
import { Op, Sequelize, Transaction } from 'sequelize';
import { Movies } from './entity/movie.entity';
import { CreationAttributes, WhereOptions } from 'sequelize';
import { title } from 'process';
import { Persons } from './person/entity/person.entity';
import { Genres } from './genre/entity/genre.entity';
import { Personas } from './entity/persona.entity';
import { CreateMoviePayload } from './constants/movie-payload.interface';
import { MoviesGenres } from './entity/movie-genre-join.entity';
import { MovieGenresType } from './constants/movielist.enums';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export class MovieListRepository {
  constructor(
    @Inject('MOVIE-REPO')
    private readonly movieRepo: typeof Movies,

    @Inject('PERSONA-REPO')
    private readonly personaRepo: typeof Personas,

    @Inject('MOVIEGENRE-REPO')
    private readonly movieGenreRepo: typeof MoviesGenres,

    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,

    private readonly elasticSearchService: ElasticsearchService

  ) { }

  //Movies Repository

  //Get One Movie
  async findOne(whereParameters: WhereOptions) {
    return await this.movieRepo.findOne({ where: whereParameters });
  }

  //FInd One with Includes

  async findOneWithInclude(
    whereParameters: WhereOptions,
    include: any[] = [],
  ): Promise<Movies | null> {
    const result = await this.movieRepo.findOne({
      where: whereParameters,
      include: include,
    });
    return result;
  }

  //Find All Movies
  async findAll() {
    const result = await this.movieRepo.findAll({
      include: [Genres, Persons],
      limit: 100,
    });
    return result;
  }

  //Find All KeySet Index
  async findAllPaginated(startId: number, count: number) {
    return await this.movieRepo.findAll({
      where: {
        id: {
          [Op.gte]: startId,
        },
      },
      order: [['id', 'ASC']],
      include: [Genres, Persons],
      limit: count,
    });
  }

  //Get Paginated List of Movies
  async findAndCountAll(limit: number, offset: number) {
    return await this.movieRepo.findAndCountAll({
      limit,
      offset: limit,
    });
  }

  //Create One Movie
  async createOne(
    payload: CreateMoviePayload,
    manager?: Transaction,
  ): Promise<Movies> {
    const newMovie = await this.movieRepo.create(
      {
        title: payload.title,
        description: payload.description,
        release_date: payload.release_date,
      },
      { transaction: manager },
    );

    if (payload.genres?.length) {
      await newMovie.$set('genres', payload.genres, { transaction: manager });
    }
    for (const person of payload.persons) {
      await this.personaRepo.create(
        {
          personId: person.id,
          movieId: newMovie.id,
          cast: person.cast,
        },
        { transaction: manager },
      );
    }
    return newMovie;
  }

  //Update One Movie
  async updateOne() { }

  //Delete One Movie
  async deleteOne(id: number, manager?: Transaction) {
    await this.personaRepo.destroy({
      where: { movieId: id },
      transaction: manager,
    });
    await this.movieGenreRepo.destroy({
      where: { movieId: id },
      transaction: manager,
    });
    const deletedCount = await this.movieRepo.destroy({
      where: { id },
      transaction: manager,
    });
    return deletedCount;
  }

  async findAllWithInclude(
    offsetNo: number,
    limitNo: number,
    genre?: MovieGenresType,
    person?: string,
  ) {
    const result = await this.movieRepo.findAndCountAll({
      include: [
        {
          model: Genres,
          required: true,
          where: genre ? { genre: genre } : undefined,
        },
        {
          model: Persons,
          required: true,
          where: person ? { name: person } : undefined,
        },
      ],
      limit: limitNo,
      offset: offsetNo,
      order: [['id', 'ASC']]
    });
    return result;
  }

  async findAllWithTextSearch(query: string) {

    const [results, metadata]: any[] = await this.sequelize.query(`
       SELECT * FROM public.movies
       WHERE to_tsvector(title) @@ to_tsquery('${query}');
      `);

    console.log("results", results);
    // console.log("Metadata", metadata)


    const movie = await this.movieRepo.findOne({
      where: { id: results[0]?.id },
      include: [Genres, Persons],
    });
    const arr: any[] = [];
    arr.push(movie)

    return arr;
  }

  async findAllInclude2() {
    const [result, metadata]: any[] = await this.sequelize.query(`
      SELECT * 
      FROM movies_flat_view
      WHERE genres = 'ROMANCE' LIMIT  100 ;
      `);

    console.log("Result", result);
    console.log("Meta data", metadata.rowCount)
    return metadata;
  }


  //Elastic Search 

  async findAllByGenre(query: any, from: number, limit: number) {
    const { hits }: any = await this.elasticSearchService.search({
      index: 'movies',
      track_total_hits: true,
      from: from,
      size: limit,
      query: query,
      sort: [{
        id: {
          order: 'asc'
        }
      }]
    });
    return hits;
  }

  //Find By Query
  async findAllByQuery(queryText: string, from: number, limit: number) {
    const { hits }: any = await this.elasticSearchService.search({
      index: 'movies',
      track_total_hits: true,
      size: limit,
      from,
      query: {
        multi_match: {
          query: queryText,
          type: 'best_fields',
          fields: [
            'title',
            'description',
            'genres',
            'persons.name',
            'persons.cast'
          ],
          fuzziness: 'AUTO'
        }
      },
      sort: [
        {
          id: {
            order: 'asc'
          }
        }
      ]
    });

    return {
      total: hits.total.value,
      results: hits.hits.map(hit => hit._source),
    }

  }


}
