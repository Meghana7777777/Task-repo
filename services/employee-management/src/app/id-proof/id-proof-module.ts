import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { IdProofController } from './id-proof-controller';
import { IdProofService } from './id-proof-services';
import { IdProofRepository } from './dto/id-proof-repo';
import { IdProof } from './dto/id-proof-entity';
@Module({
  imports:[TypeOrmModule.forFeature([IdProof])],
  controllers: [IdProofController],
  providers: [IdProofService,IdProofRepository, ApplicationExceptionHandler]
})
export class IdProofModule {}
