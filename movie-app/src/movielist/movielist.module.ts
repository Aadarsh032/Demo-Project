import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { MovielistController } from './movielist.controller';
import { MovielistService } from './movielist.service';
import { Persons } from './person/entity/person.entity';
import { Movies } from './entity/movie.entity';

import { Personas } from './entity/persona.entity';
import { MoviesGenres } from './entity/movie-genre-join.entity';
import { GenreController } from './genre/genre.controller';
import { GenreService } from './genre/genre.service';
import { GenreModule } from './genre/genre.module';
import { PersonModule } from './person/person.module';
import { MovieListRepository } from './movielist.repository';
import { DatabaseModule } from 'src/database/database.module';
import { movieProviders, moviesGenreProvider, personaProvider } from './constants/movie.providers';
import { CACHE_MODULE_OPTIONS, CacheModule } from '@nestjs/cache-manager';
import { ElasticModule } from 'src/elastic/elastic.module';
import { MovieIndexQueue } from 'src/queue/movie-index.queue';
import { QueueModule } from 'src/queue/queue.module';

@Module({
    imports: [
        DatabaseModule,
        GenreModule,
        PersonModule,
        ElasticModule,
        QueueModule
    ],
    controllers: [MovielistController],
    providers: [...movieProviders, ...personaProvider, ...moviesGenreProvider, MovielistService, MovieListRepository],
    exports:['MOVIE-REPO',
    'PERSONA-REPO',
    'MOVIEGENRE-REPO',MovieListRepository]
})
export class MovielistModule { }
