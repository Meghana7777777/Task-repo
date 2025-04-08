import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { AttributesModule } from './attributes/attributes.module';
import { AuthenticationsModule } from './authentications/authentications.module';
import { ClientAppsModule } from './client-applications/client-apps.module';
import { MenusModule } from './menus/menus.module';
import { ModulesModule } from './modules/modules.module';
import { OrganizationModule } from './organization/organization.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolesModule } from './roles/roles.module';
import { ScopesModule } from './scopes/scopes-module';
import { SubMenusModule } from './sub-menus/sub-menus.module';
import { UnitsModule } from './units/units.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { UserToAttributesModule } from './user-to-attributes/user-to-attributes.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
   AttributesModule,
    OrganizationModule,
    ClientAppsModule,
    UnitsModule,
    ScopesModule,
    MenusModule,
    SubMenusModule,
    PermissionsModule,
    RolePermissionsModule,
     UserPermissionsModule,
    UsersModule,
    AuthenticationsModule,
    UserToAttributesModule,
    RolesModule, 
    UserRolesModule,
    ApplicationsModule,
    ModulesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
