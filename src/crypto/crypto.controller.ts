import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller()
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}
  @Get('crypto')
  getCrypto() {
    return this.cryptoService.getRates();
  }
}
