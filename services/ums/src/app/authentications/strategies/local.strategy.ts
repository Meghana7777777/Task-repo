import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationsService } from '../authentications.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private moduleRef: ModuleRef, private readonly authService: AuthenticationsService) {
    super({ passReqToCallback: true });
  }

  async validate(req: any, username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(req.body.username, password);
    console.log(user)
    if (!user) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }
    return { ...user };
  }
}

