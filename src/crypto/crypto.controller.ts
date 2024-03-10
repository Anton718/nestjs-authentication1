import { Controller, Get, Param } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}
  @Get(':id')
  getCrypto(@Param('id') id: number) {
    return this.cryptoService.getRates(id);
  }
}
