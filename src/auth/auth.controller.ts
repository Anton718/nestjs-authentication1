import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DTO } from './auth.dto';

@Controller('post')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('data')
  postData(@Body() dto: DTO) {
    return this.authService.postData(dto);
  }
  @Get('data/:id')
  delData(@Param('id') id: number) {
    return this.authService.delData(id);
  }
}
