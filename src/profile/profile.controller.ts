import { Body, Controller, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { profileDTO, updateDTO } from './profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Post('create_profile')
  createProfile(@Body() dto: profileDTO) {
    return this.profileService.createProfile(dto);
  }
  @Post('update_profile')
  updateProfile(@Body() dtoUpdated: updateDTO) {
    return this.profileService.updateProfile(dtoUpdated);
  }
}
