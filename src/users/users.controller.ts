import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { IdParam } from '../dto/id.param';
import { Auth } from '../auth/guards/auth.guard';
import { User } from '../auth/extract-user-req';
import { VerifiedToken } from '../auth/helpers/types';
import { UsersService } from './users.service';
import { PublicUserKeys } from './helpers/constants';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Auth()
  @Patch(':id')
  async updateOne(
    @Param() { id }: IdParam,
    @User() { userId, role }: VerifiedToken,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (userId !== id && role !== 'admin') {
      throw new ForbiddenException("You don't have permission");
    }
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService
      .updateOne({ _id: id }, updateUserDto, {
        new: true,
        projection: PublicUserKeys.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
      })
      .lean()
      .exec();
  }
}
