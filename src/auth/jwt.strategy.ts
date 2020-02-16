import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const { JWT_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    const { birthdate, email, sub: id, name } = payload;

    return {
      birthdate,
      email,
      id,
      name,
    };
  }
}
