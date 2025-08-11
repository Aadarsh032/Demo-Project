import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Job } from "bullmq";
import { resolve } from "path";
import { MovieListRepository } from "src/movielist/movielist.repository";

@Processor('movie-queue',{concurrency:5})
@Injectable()
export class MovieSubscriber extends WorkerHost {
    private readonly logger = new Logger(MovieSubscriber.name);
    constructor(private readonly movieRepository: MovieListRepository,
        private readonly elasticsearchService: ElasticsearchService
    ) {
        super();
    }

    async process(job: Job): Promise<any> {

        this.logger.debug(`Job data: ${JSON.stringify(job.data)}`);

        switch (job.name) {
            case 'process-movie':
                await this.handleMovieJob(job.data);
                break;
            default:
                this.logger.warn(`Unknown job :${job.name}`);
        }
    }

    private async handleMovieJob(movieData: any) {
        try {
            console.log("Movie Data", movieData)
            this.logger.log(`Handling movie : ${movieData}`);
            const  movieId  = movieData;
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
            console.log("Result", result);
            console.log("Successfully added to the Index via Queue");

            await new Promise(() => setTimeout(resolve, 1000));
            this.logger.log(`Movie job completed :${movieData.id}`);
        } catch (error) {
            this.logger.error(`An unexpected error occured while  adding document to elastic index movies`, error)
        }
    }

    @OnWorkerEvent('completed')
    onCompleted(job) {
        this.logger.log(`Job ${job.id} completed`);
    }

    @OnWorkerEvent('failed')
    onFailed(job, error) {
        this.logger.error(`Job ${job.id} failed: ${error.message}`);
    }

}