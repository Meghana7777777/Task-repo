import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ReviewRatingsEntity } from "../entites/review-entity";
@Injectable()
export class ReviewRatingRepository extends Repository<ReviewRatingsEntity> {

    constructor(@InjectRepository(ReviewRatingsEntity) private reviewRatingRepo: Repository<ReviewRatingsEntity>
    ) {
        super(reviewRatingRepo.target, reviewRatingRepo.manager, reviewRatingRepo.queryRunner);
    }


}