import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config';
import { MovielistModule } from './movielist/movielist.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-ioredis';


@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal:true,
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
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
