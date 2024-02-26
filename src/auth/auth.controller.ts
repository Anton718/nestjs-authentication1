import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DTO } from './auth.dto';
import { updateDTO } from './updateAuth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  postData(@Body() dto: DTO) {
    return this.authService.postData(dto);
  }
  @Get('delete/:id')
  delData(@Param('id') id: number) {
    return this.authService.delData(id);
  }
  @Get('all')
  getAllData() {
    return this.authService.getAllData();
  }
  @Post('update')
  updateAuth(@Body() updatedDTO: updateDTO) {
    return this.authService.updateAuth(updatedDTO);
  }
}
