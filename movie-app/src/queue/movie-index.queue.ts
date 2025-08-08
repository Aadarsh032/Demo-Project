// src/queue/movie-index.queue.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MovieIndexQueue {
  constructor(
    @InjectQueue('movie-index') private readonly queue: Queue,
  ) {}

  async addJob(movieId: number) {
    await this.queue.add('add-index-movie', { movieId });
  }
}
