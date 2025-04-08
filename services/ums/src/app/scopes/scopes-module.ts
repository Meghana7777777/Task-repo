import { Module } from '@nestjs/common';
import { ScopeService } from './scopes-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScopesEntity } from './entites/scopes.entity';
import { ScopeController } from './scopes-controller';
import { ScopesRepository } from './repo/scopes.repo';
import { ScopeAdapter } from './scopes-adapter';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([ScopesEntity])],
  controllers: [ScopeController],
  providers: [ScopeService, ScopesRepository, ScopeAdapter,ApplicationExceptionHandler]
})
export class ScopesModule { }
