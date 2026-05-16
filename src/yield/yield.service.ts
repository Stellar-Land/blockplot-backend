import { Injectable } from '@nestjs/common';

export interface YieldPool {
  totalDeposited: number;
  claimable: Map<string, number>;
}

@Injectable()
export class YieldService {
  private readonly pools = new Map<string, YieldPool>();

  private getOrCreate(assetId: string): YieldPool {
    if (!this.pools.has(assetId)) {
      this.pools.set(assetId, { totalDeposited: 0, claimable: new Map() });
    }
    return this.pools.get(assetId)!;
  }

  deposit(assetId: string, amount: number) {
    const pool = this.getOrCreate(assetId);
    pool.totalDeposited += amount;
    return { assetId, totalDeposited: pool.totalDeposited };
  }

  allocate(assetId: string, walletAddress: string, allocationBps: number) {
    const pool = this.getOrCreate(assetId);
    const share = (pool.totalDeposited * allocationBps) / 10_000;
    const current = pool.claimable.get(walletAddress) ?? 0;
    pool.claimable.set(walletAddress, current + share);
    return { walletAddress, allocated: share };
  }

  getClaimable(assetId: string, walletAddress: string) {
    const pool = this.pools.get(assetId);
    return { walletAddress, claimable: pool?.claimable.get(walletAddress) ?? 0 };
  }

  claim(assetId: string, walletAddress: string) {
    const pool = this.getOrCreate(assetId);
    const amount = pool.claimable.get(walletAddress) ?? 0;
    pool.claimable.set(walletAddress, 0);
    return { walletAddress, claimed: amount };
  }
}
