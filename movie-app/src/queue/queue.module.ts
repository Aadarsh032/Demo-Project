// src/queue/queue.module.ts
import { forwardRef, Logger, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { queueConfig } from './queue.config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MovieIndexQueue } from './movie-index.queue';
import { MovieIndexProcessor } from './movie-index.processor';
import { MovieListRepository } from 'src/movielist/movielist.repository';
import { MovielistModule } from 'src/movielist/movielist.module';
import { DatabaseModule } from 'src/database/database.module';
import { ElasticModule } from 'src/elastic/elastic.module';

@Module({
  imports: [
    BullModule.forRoot(queueConfig),
    BullModule.registerQueue({
      name: 'movie-index',
    }),
    forwardRef(() => MovielistModule), DatabaseModule , ElasticModule ],
  providers: [
    MovieIndexQueue,
    MovieIndexProcessor, 
    MovieListRepository,
    Logger
  ],
  exports: [MovieIndexQueue],
})
export class QueueModule {}
