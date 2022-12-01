import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CryptoService {
  saltRound: 10;
  comparePasswords(password: string, encryptedPassword: string) {
    return bcrypt.compareSync(password, encryptedPassword);
  }
  hashPassword(password: string) {
    return bcrypt.hashSync(password, this.saltRound);
  }
  generateSessionToken() {
    return uuid();
  }
}
