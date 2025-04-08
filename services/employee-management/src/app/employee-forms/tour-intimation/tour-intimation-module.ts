import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourIntimationEntity } from './entities/tour-intimation-entity';
import { TourIntimationController } from './tour-intimation-controller';
import { TourIntimationRepository } from './repositorys/tour-intimation-repo';
import { TourIntimationService } from './tour-intimation-service';
import { TourDetailsEntity } from './entities/tour-details-entity';
import { TourClaimRepository } from './repositorys/tour-claim-repo';
import { TourClaimEntity } from './entities/tour-claim-entity';
import { TcFareDetailsEntity } from './entities/tour-claim-fare-details';
import { TcLocalConvyDetailsEntity } from './entities/tour-claim-local-convy-details';
import { TcTaDaDetailsEntity } from './entities/tour-claim-taDa-details';
import { TcOtherExpDetailsEntity } from './entities/tour-claim-other-exp-details';



@Module({
  imports: [
    TypeOrmModule.forFeature([TourIntimationEntity, TourDetailsEntity, TourClaimEntity, TcFareDetailsEntity, TcLocalConvyDetailsEntity, TcTaDaDetailsEntity, TcOtherExpDetailsEntity])
  ],
  controllers: [TourIntimationController],
  providers: [TourIntimationRepository,TourIntimationService,ApplicationExceptionHandler, TourClaimRepository ],
})
export class TourIntimationModule { }
