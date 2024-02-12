import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DTO } from './auth.dto';

@Controller('execute')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request')
  postRequest(@Body() dto: DTO) {
    return this.authService.postRequest(dto);
  }
}
