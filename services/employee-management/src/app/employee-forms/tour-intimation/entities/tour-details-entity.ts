import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TourIntimationEntity } from "./tour-intimation-entity";

@Entity('tour_details')
export class TourDetailsEntity extends AbstractEntity {

    @Column('varchar', {
        name: "from_place",
        length: 255,
        nullable: true,
    })
    fromPlace: string

    @Column('varchar', {
        name: "to_place",
        length: 255,
        nullable: true,
    })
    toPlace: string

    @Column('varchar', {
        name: "from_date",
        nullable: true,
    })
    fromDate: string

    @Column('varchar', {
        name: "to_date",
        nullable: true,
    })
    toDate: string

    @ManyToOne((type) => TourIntimationEntity, (tour) => tour.tourId)
    @JoinColumn({ name: 'tour_id' })
    tourId: TourIntimationEntity

}