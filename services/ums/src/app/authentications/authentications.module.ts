import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationAdapter } from './decorators/authentication-adapter';
import { AuthenticationEntity } from './entities/authentications.entity';
import { AuthenticationRepository } from './repositories/authentication.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { MailerModule } from '../../__common__/mailer/mailer.module';
import { UsersService } from '@hrexpert/shared-services';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthenticationEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtConfig').jwtSecret,
        signOptions: { expiresIn: configService.get('jwtConfig').jwtExpiryTime },
      }),
      inject: [ConfigService],
    }),
    UserRolesModule,
    MailerModule,
  ],
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService, AuthenticationRepository, LocalStrategy, JwtStrategy, RefreshTokenStrategy, AuthenticationAdapter,ApplicationExceptionHandler,UsersService],
  exports: [TypeOrmModule, AuthenticationsService,],
})
export class AuthenticationsModule { }
