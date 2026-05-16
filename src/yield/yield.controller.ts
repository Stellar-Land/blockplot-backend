import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { YieldService } from './yield.service';

@Controller('yield')
export class YieldController {
  constructor(private readonly yieldService: YieldService) {}

  @Post(':assetId/deposit')
  deposit(@Param('assetId') assetId: string, @Body() body: { amount: number }) {
    return this.yieldService.deposit(assetId, body.amount);
  }

  @Get(':assetId/claimable/:walletAddress')
  claimable(
    @Param('assetId') assetId: string,
    @Param('walletAddress') walletAddress: string,
  ) {
    return this.yieldService.getClaimable(assetId, walletAddress);
  }

  @Post(':assetId/claim/:walletAddress')
  claim(
    @Param('assetId') assetId: string,
    @Param('walletAddress') walletAddress: string,
  ) {
    return this.yieldService.claim(assetId, walletAddress);
  }
}
