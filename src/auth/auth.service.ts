import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/user/user.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    const validPassword = await compare(password, user.password);
    let response = null;

    if (user && validPassword) response = user;

    return response;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      sub: user._id,
      name: user.name,
      birthdate: user.birthdate,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
