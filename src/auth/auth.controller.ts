import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DTO } from './auth.dto';

@Controller('post')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('data')
  postData(@Body() dto: DTO) {
    return this.authService.postData(dto);
  }
}
