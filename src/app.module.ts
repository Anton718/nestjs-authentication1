import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './auth/entities/auth.entity';
import { ProfileModule } from './profile/profile.module';
import { ProfileEntity } from './profile/entities/profile.entity';
import { CryptoModule } from './crypto/crypto.module';
import { WalletEntity } from './wallet/entities/wallet.entity';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest-data',
      entities: [AuthEntity, ProfileEntity, WalletEntity],
      synchronize: true,
    }),
    AuthModule,
    ProfileModule,
    CryptoModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
