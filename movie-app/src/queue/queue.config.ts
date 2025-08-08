// src/queue/queue.config.ts
import { BullRootModuleOptions } from '@nestjs/bullmq';

export const queueConfig: BullRootModuleOptions = {
  connection: {
    host: 'localhost',
    port: 6379,
  },
};
