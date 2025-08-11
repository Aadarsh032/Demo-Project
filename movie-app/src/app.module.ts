import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config';
import { MovielistModule } from './movielist/movielist.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ElasticModule } from './elastic/elastic.module';
import redisStore from 'cache-manager-ioredis';
import { BullModule } from '@nestjs/bullmq';
import { MovieListRepository } from './movielist/movielist.repository';
import { queueConfig } from './queue/queue.config';
import { QueueModule } from './queue/queue.module';
import { MovieQueue } from './queue/movie.queue';
import { MovieSubscriber } from './queue/movie.subscriber';


@Module({
  imports: [
    BullModule.forRoot(queueConfig),
    // BullModule.registerQueue({
    //   name: 'movie-queue',
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore as any,
        host: 'localhost',
        port: 6379,
        ttl: 60 * 5,
      })
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MovielistModule,
    UserModule,
    DatabaseModule,
    ElasticModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule { }
