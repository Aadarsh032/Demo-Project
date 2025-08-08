// src/queue/movie-index.processor.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MovieListRepository } from 'src/movielist/movielist.repository';
import { Worker, Job } from 'bullmq';
import { queueConfig } from './queue.config';

@Injectable()
export class MovieIndexProcessor implements OnModuleInit {
    constructor(
        private readonly movieRepository: MovieListRepository,
        private readonly elasticsearchService: ElasticsearchService,
        private logger :Logger
    ) { }

    onModuleInit() {
        new Worker(
            'movie-index',
            async (job: Job) => {
                if (job.name === 'add-index-movie') {
                    await this.handleAddIndexMovie(job);
                }
            },
            {
                connection: queueConfig.connection,
            },
        );
    }

    private async handleAddIndexMovie(job: Job) {
        try{

        }catch(error){
           this.logger.error(`An unexpected error occured while  adding document to elastic index movies`, error )
        }
        const { movieId } = job.data;

        const movie = await this.movieRepository.findOneWithAssociations(movieId);
        if (!movie) throw new Error(`Movie ID ${movieId} not found`);

        const movieDoc = {
            id: movie?.dataValues?.id,
            title: movie?.dataValues?.title,
            description: movie?.dataValues?.description,
            genres: movie?.dataValues?.genres.map((g) => g.dataValues.genre),
            persons: movie?.dataValues?.persons.map((p) => ({
                name: p.name,
                cast: (p as any).Personas?.cast,
            })),
        };
        const result = await this.elasticsearchService.index({
            index: 'movies',
            id: movie.id.toString(),
            document: movieDoc,
        });
    }
}
