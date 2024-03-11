import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletEntity } from './entities/wallet.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ProfileEntity } from 'src/profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity, AuthEntity, ProfileEntity]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
