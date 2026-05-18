import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { IndexerService } from './indexer.service';

@Controller('indexer')
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  async start() {
    await this.indexerService.start();
    return {
      message: 'Indexer started successfully',
      status: this.indexerService.getStatus(),
    };
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  async stop() {
    await this.indexerService.stop();
    return {
      message: 'Indexer stopped successfully',
      status: this.indexerService.getStatus(),
    };
  }

  @Get('status')
  getStatus() {
    return this.indexerService.getStatus();
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async reset() {
    await this.indexerService.reset();
    return {
      message: 'Indexer reset successfully',
      status: this.indexerService.getStatus(),
    };
  }
}
