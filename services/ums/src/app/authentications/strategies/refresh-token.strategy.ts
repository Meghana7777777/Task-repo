import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationsService } from '../authentications.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(private readonly jwtService: JwtService, private readonly authService: AuthenticationsService, configService: ConfigService) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: configService.get('logLevel'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          var data = request?.cookies['tokens-data'];
          if (data == null) {
            return null;
          }
          return data.refreshToken;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    var data = req?.cookies['tokens-data'];
    if (!data.refreshToken) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }
    if (payload == null) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }
    const decodedJwtAccessToken = this.jwtService.decode(data.refreshToken);
    const user = await this.authService.getUserIfRefreshTokenMatches(data.refreshToken, decodedJwtAccessToken['username']);
    if (user == null) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }
    return {
      ...user
    };
  }
}
