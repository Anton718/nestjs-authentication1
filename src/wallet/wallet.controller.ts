import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { walletDTO } from './wallet.dto';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create_wallet')
  createWallet(@Body() dto: walletDTO) {
    return this.walletService.createWallet(dto);
  }
}
