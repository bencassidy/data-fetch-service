import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import axios from 'axios';
import { JobsService } from './jobs.service';

@Processor('data-fetch')
export class DataFetchProcessor {
  constructor(private jobsService: JobsService) {}

  @Process('fetch-data')
  async handleJob(job: Job) {
    const { id, url } = job.data;
    const { data } = await axios.get(url);
    this.jobsService.updateJobData(id, data);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(`Completed job ${job.id} of type ${job.name}`);
  }
}
