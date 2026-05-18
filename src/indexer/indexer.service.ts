import { Injectable, Logger } from '@nestjs/common';

export interface IndexerStatus {
  isRunning: boolean;
  lastBlockIndexed: number | null;
  currentBlock: number | null;
  startedAt: Date | null;
}

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);
  private isRunning = false;
  private lastBlockIndexed: number | null = null;
  private currentBlock: number | null = null;
  private startedAt: Date | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Start the indexer
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Indexer is already running');
      return;
    }

    this.logger.log('Starting indexer...');
    this.isRunning = true;
    this.startedAt = new Date();
    this.currentBlock = 0;

    // Simulate indexing blocks every 5 seconds
    this.intervalId = setInterval(() => {
      this.indexNextBlock();
    }, 5000);
  }

  /**
   * Stop the indexer
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Indexer is not running');
      return;
    }

    this.logger.log('Stopping indexer...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Get indexer status
   */
  getStatus(): IndexerStatus {
    return {
      isRunning: this.isRunning,
      lastBlockIndexed: this.lastBlockIndexed,
      currentBlock: this.currentBlock,
      startedAt: this.startedAt,
    };
  }

  /**
   * Index the next block
   */
  private async indexNextBlock(): Promise<void> {
    if (!this.isRunning) return;

    try {
      this.currentBlock = (this.currentBlock || 0) + 1;
      this.logger.log(`Indexing block ${this.currentBlock}...`);

      // Simulate block processing
      await this.processBlock(this.currentBlock);

      this.lastBlockIndexed = this.currentBlock;
      this.logger.log(`Block ${this.currentBlock} indexed successfully`);
    } catch (error) {
      this.logger.error(`Error indexing block ${this.currentBlock}:`, error);
    }
  }

  /**
   * Process a single block
   */
  private async processBlock(blockNumber: number): Promise<void> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Add your block processing logic here
    this.logger.debug(`Processing block ${blockNumber}`);
  }

  /**
   * Reset indexer state
   */
  async reset(): Promise<void> {
    await this.stop();
    this.lastBlockIndexed = null;
    this.currentBlock = null;
    this.startedAt = null;
    this.logger.log('Indexer state reset');
  }
}
