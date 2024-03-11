// import { Body, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ProfileEntity } from './entities/wallet.entity';
// import { profileDTO, updateDTO } from './wallet.dto';
// import { AuthEntity } from 'src/auth/entities/auth.entity';

// @Injectable()
// export class ProfileService {
//   constructor(
//     @InjectRepository(ProfileEntity)
//     private profileRepository: Repository<ProfileEntity>,
//     @InjectRepository(AuthEntity)
//     private authRepository: Repository<AuthEntity>,
//   ) {}
//   async createProfile(@Body() dto: profileDTO) {
//     const authEntry = await this.authRepository.findOne({
//       where: { username: dto.username },
//     });
//     if (authEntry) {
//       const checkProfileEntry = await this.profileRepository.findOne({
//         where: { username: dto.username },
//       });
//       if (checkProfileEntry) {
//         return { error: 'profile exists' };
//       }
//       const date = new Date();
//       this.profileRepository.save({
//         auth_id: authEntry.id,
//         username: dto.username,
//         info: dto.info,
//         dateCreated: date.getTime().toString(),
//       });
//       return { success: 'profile created' };
//     }
//     return { error: 'failed to create a profile' };
//   }
//   async updateProfile(@Body() dtoUpdated: updateDTO) {
//     const updated = await this.profileRepository.findOne({
//       where: { username: dtoUpdated.username },
//     });
//     if (!updated) {
//       return { result: 'no matches in database' };
//     }
//     if (
//       updated.username == dtoUpdated.username &&
//       dtoUpdated.info !== undefined
//     ) {
//       await this.profileRepository.update(
//         {
//           username: dtoUpdated.username,
//         },
//         { info: dtoUpdated.info },
//       );
//       return { result: 'updated' };
//     }
//     return { result: 'not updated' };
//   }
// }
