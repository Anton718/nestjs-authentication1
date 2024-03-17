import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { profileDTO } from './profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Post('create_profile')
  createProfile(@Body() dto: profileDTO) {
    return this.profileService.createProfile(dto);
  }
  @Post('top_balance')
  topBalance(@Body() dto: { username: string; amount: string }) {
    return this.profileService.topBalance(dto);
  }
  @Get('user_profile/:id')
  viewProfile(@Param('id') id: number) {
    return this.profileService.viewProfile(id);
  }
}
