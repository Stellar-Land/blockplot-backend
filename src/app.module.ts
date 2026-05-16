import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './identity/identity.module';
import { AssetsModule } from './assets/assets.module';
import { YieldModule } from './yield/yield.module';

@Module({
  imports: [IdentityModule, AssetsModule, YieldModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
