import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Job } from './job.model';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get('/:id/status')
  getJobStatus(@Param('id') id: string): Promise<string> {
    return this.jobsService.getJobStatus(id);
  }

  @Get('/:id/results')
  getJobResults(@Param('id') id: string): object {
    return this.jobsService.getJobResults(id);
  }

  @Post()
  createJob(@Body('url') url: string): Promise<Job> {
    return this.jobsService.createJob(url);
  }

  @Delete('/:id')
  deleteJob(@Param('id') id: string): Promise<string> {
    return this.jobsService.deleteJob(id);
  }
}
