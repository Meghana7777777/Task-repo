import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmAsyncConfig, typeOrmConfig } from "./type-orm-config/typeorm.config";
import { ConfigService } from "@nestjs/config";
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      ...typeOrmAsyncConfig,
      inject: [ConfigService]
    }),
  ],
})
export class DatabaseModule { }