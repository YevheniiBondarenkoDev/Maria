import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './guards/auth.guard';
import { User } from './extract-user-req';
import { SuccessfulAuth, VerifiedToken } from './helpers/types';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<SuccessfulAuth> {
    return this.authService.login(loginDto);
  }
  @Post('registration')
  registration(@Body() loginDto): Promise<SuccessfulAuth> {
    return this.authService.register(loginDto);
  }
  @Auth()
  @Patch('logout')
  logout(@User() { userId }: VerifiedToken) {
    return this.authService.logout(userId);
  }
  @Auth()
  @Patch('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() { userId }: VerifiedToken,
  ): Promise<SuccessfulAuth> {
    return this.authService.changePassword(changePasswordDto, userId);
  }
}
