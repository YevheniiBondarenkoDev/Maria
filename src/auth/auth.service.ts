import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CryptoService } from '../crypto/crypto.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SuccessfulAuth } from './helpers/types';

@Injectable()
export class AuthService {
  private readonly JWTConfig: JwtSignOptions;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {
    this.JWTConfig = {
      secret: 'maria',
    };
  }

  async login({ email, password }: LoginDto): Promise<SuccessfulAuth> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('There was a problem with your login');
    }
    const isAuthenticPassword = this.cryptoService.comparePasswords(
      password,
      user.password,
    );
    if (!isAuthenticPassword) {
      throw new UnauthorizedException('There was a problem with your login');
    }
    const userId = user._id.toHexString();
    const sessionToken = user.sessionToken
      ? user.sessionToken
      : this.cryptoService.generateSessionToken();
    if (!user.sessionToken) {
      await this.usersService.updateOne(
        { _id: userId },
        { $set: { sessionToken } },
      );
    }
    const accessToken = this.jwtService.sign(
      { userId, sessionToken },
      this.JWTConfig,
    );
    return {
      accessToken,
      user: {
        role: user.role,
        _id: user._id.toHexString(),
      },
    };
  }

  async register({ email, password }: LoginDto): Promise<SuccessfulAuth> {
    const user = await this.usersService.findOne({ email });
    if (user) {
      throw new UnauthorizedException('This email is already taken');
    }
    const hashedPassword = this.cryptoService.hashPassword(password);
    const sessionToken = this.cryptoService.generateSessionToken();
    const { _id: userId, role } = await this.usersService.create({
      password: hashedPassword,
      email,
      sessionToken,
      role: 'user',
    });
    const accessToken = this.jwtService.sign(
      { userId: userId.toHexString(), sessionToken },
      this.JWTConfig,
    );
    return {
      accessToken,
      user: {
        role,
        _id: userId.toHexString(),
      },
    };
  }
  async logout(userId: string) {
    await this.usersService.updateOne(
      { _id: userId },
      { $set: { sessionToken: null } },
    );
  }

  async changePassword(
    { oldPassword, updatedPassword }: ChangePasswordDto,
    userId: string,
  ): Promise<SuccessfulAuth> {
    const user = await this.usersService.findById(userId);
    const isIdentical = this.cryptoService.comparePasswords(
      oldPassword,
      user.password,
    );
    if (!isIdentical) {
      throw new BadRequestException('Incorrect password');
    }
    const hashedPassword = this.cryptoService.hashPassword(updatedPassword);
    const sessionToken = this.cryptoService.generateSessionToken();
    await this.usersService.updateOne(
      { _id: userId },
      { $set: { sessionToken, password: hashedPassword } },
    );
    const accessToken = this.jwtService.sign(
      { userId, sessionToken },
      this.JWTConfig,
    );
    return {
      accessToken,
      user: {
        role: user.role,
        _id: user._id.toHexString(),
      },
    };
  }
}
