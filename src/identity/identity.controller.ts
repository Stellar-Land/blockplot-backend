import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('submit')
  submit(@Body() body: { walletAddress: string; kycData: Record<string, unknown> }) {
    return this.identityService.submitKyc(body.walletAddress, body.kycData);
  }

  @Get(':walletAddress')
  getStatus(@Param('walletAddress') walletAddress: string) {
    return this.identityService.getStatus(walletAddress);
  }

  @Patch(':walletAddress/approve')
  approve(@Param('walletAddress') walletAddress: string) {
    return this.identityService.approve(walletAddress);
  }

  @Patch(':walletAddress/revoke')
  revoke(@Param('walletAddress') walletAddress: string) {
    return this.identityService.revoke(walletAddress);
  }
}
