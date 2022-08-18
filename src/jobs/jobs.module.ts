import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { DataFetchProcessor } from './jobs.processor';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'data-fetch',
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, DataFetchProcessor],
})
export class JobsModule {}
