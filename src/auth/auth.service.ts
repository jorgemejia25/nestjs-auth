import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDto } from 'src/user/dtos/user.dto';
import { JwtPayload } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dtos/user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface LoginStatus {
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.userService.create(user);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUser: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.userService.findByLogin(loginUser);

    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  private _createToken({ username }: User): any {
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
