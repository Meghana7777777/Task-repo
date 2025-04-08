import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: configService.get('jwtConfig').jwtByCookieOrHeader === 'cookie' ? ExtractJwt.fromExtractors([(request: Request) => {
        // console.log(request.cookies,'cookies')
        // console.log(request.headers.cookie,'cookie')
        const data = request?.cookies['tokens-data'];
        // console.log(data,'**************************')
        if (data == null) {
          return null;
        };
        return data.accessToken;
      }]) : ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtConfig').jwtSecret,
    });
  }

  async validate(payload: any) {
    // console.log(payload,'************8')
    if (payload == null) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }
    return payload
  }
}