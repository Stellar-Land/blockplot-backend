import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface Asset {
  id: string;
  name: string;
  totalSupply: number;
  ownerCap: number;
  priceUsd: number;
  createdAt: Date;
}

@Injectable()
export class AssetsService {
  private readonly assets = new Map<string, Asset>();

  createAsset(data: { name: string; totalSupply: number; ownerCap: number; priceUsd: number }): Asset {
    const asset: Asset = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    this.assets.set(asset.id, asset);
    return asset;
  }

  findAll(): Asset[] {
    return Array.from(this.assets.values());
  }

  findOne(id: string): Asset {
    const asset = this.assets.get(id);
    if (!asset) throw new NotFoundException(`Asset ${id} not found`);
    return asset;
  }
}
