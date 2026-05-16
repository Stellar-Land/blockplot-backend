import { Injectable, NotFoundException } from '@nestjs/common';

export type IdentityStatus = 'pending' | 'verified' | 'revoked';

export interface IdentityRecord {
  walletAddress: string;
  status: IdentityStatus;
  kycData: Record<string, unknown>;
  updatedAt: Date;
}

@Injectable()
export class IdentityService {
  private readonly records = new Map<string, IdentityRecord>();

  submitKyc(walletAddress: string, kycData: Record<string, unknown>) {
    const record: IdentityRecord = {
      walletAddress,
      status: 'pending',
      kycData,
      updatedAt: new Date(),
    };
    this.records.set(walletAddress, record);
    return record;
  }

  getStatus(walletAddress: string) {
    const record = this.records.get(walletAddress);
    if (!record) throw new NotFoundException('Identity record not found');
    return record;
  }

  approve(walletAddress: string) {
    const record = this.getStatus(walletAddress);
    record.status = 'verified';
    record.updatedAt = new Date();
    return record;
  }

  revoke(walletAddress: string) {
    const record = this.getStatus(walletAddress);
    record.status = 'revoked';
    record.updatedAt = new Date();
    return record;
  }

  isVerified(walletAddress: string): boolean {
    const record = this.records.get(walletAddress);
    return record?.status === 'verified';
  }
}
