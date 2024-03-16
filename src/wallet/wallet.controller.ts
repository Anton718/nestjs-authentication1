import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { walletDTO, transactionDTO } from './wallet.dto';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create_wallet')
  createWallet(@Body() dto: walletDTO) {
    return this.walletService.createWallet(dto);
  }

  @Get('wallet/:id')
  getWalletInfo(@Param('id') id: number) {
    return this.walletService.getWalletInfo(id);
  }

  @Post('trade_crypto')
  tradeCrypto(@Body() dto: transactionDTO) {
    return this.walletService.tradeCrypto(dto);
  }
}
