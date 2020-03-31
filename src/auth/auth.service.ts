import { User } from '@app/user/interface/user.interface';
import { UserService } from '@app/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    const validPassword = await compare(password, user.password);

    if (user && validPassword) return user;

    return;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const { birthdate, email, name, _id: sub } = user;

    return {
      access_token: this.jwtService.sign({
        birthdate,
        email,
        name,
        sub,
      }),
    };
  }
}
