// src/queue/queue.module.ts
import { forwardRef, Logger, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { queueConfig } from './queue.config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { MovieIndexQueue } from './movie-index.queue';
// import { MovieIndexProcessor } from './movie-index.processor';
import { MovieListRepository } from 'src/movielist/movielist.repository';
import { MovielistModule } from 'src/movielist/movielist.module';
import { DatabaseModule } from 'src/database/database.module';
import { ElasticModule } from 'src/elastic/elastic.module';
import { MovieQueue } from './movie.queue';
import { MovieSubscriber } from './movie.subscriber';

@Module({
  imports: [
    // BullModule.forRoot(queueConfig),
    // BullModule.registerQueue({
    //   name: 'movie-index',
    // }),
     BullModule.registerQueue({
      name: 'movie-queue', // worker listens on this
    }),
    forwardRef(() => MovielistModule), DatabaseModule , ElasticModule ],
  providers: [
    // MovieIndexQueue,
    MovieQueue,
    // MovieIndexProcessor, 
    MovieListRepository,
    MovieSubscriber,
    Logger
  ],
  exports: [MovieQueue],
})
export class QueueModule {}
