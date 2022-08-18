import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Job } from './job.model';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('data-fetch') private jobQueue: Queue) {}
  private jobs: object = {};
  private urls: object = {};

  async createJob(url: string): Promise<Job> {
    const now = Date.now();
    const id = uuid();

    if (this.isRecentUrl(url, now)) {
      throw new BadRequestException(
        'URL has been submitted within the last hour',
      );
    }

    const job: Job = {
      id,
      url,
      createdAt: now,
      updatedAt: now,
    };

    await this.jobQueue.add('fetch-data', { id, url }, { jobId: id });

    this.jobs[id] = job;
    this.urls[url] = now;

    return job;
  }

  async getJobStatus(id): Promise<string> {
    const job = await this.jobQueue.getJob(id);
    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }

    if (!job.finishedOn) {
      return `Job ${id} is in progress`;
    }

    return `Job ${id} is complete`;
  }

  getJobResults(id): object {
    if (this.jobs[id]) return this.jobs[id].data;

    throw new NotFoundException(`Job ${id} not found`);
  }

  async deleteJob(id: string): Promise<string> {
    await this.jobQueue.removeJobs(id);
    delete this.jobs[id];
    return `Job ${id} has been deleted`;
  }

  updateJobData(id, data) {
    this.jobs[id].data = data;
  }

  isRecentUrl(url, now): boolean {
    const hourInMilliseconds = 3600000;
    const lastSubmittedTime = this.urls[url];
    if (lastSubmittedTime && now - lastSubmittedTime <= hourInMilliseconds) {
      return true;
    }

    return false;
  }
}
