import { TourIntimationEnum, TourTypeEnum } from "@hrexpert/shared-models";
import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity, OneToMany } from "typeorm";
import { TourDetailsEntity } from "./tour-details-entity";

@Entity('tour_intimation')
export class TourIntimationEntity extends AbstractEntity {

    @Column('int', { name: 'employee_id', nullable: true })
    employeeId: number

    @Column('enum', {
        name: 'permission',
        enum: TourIntimationEnum,
        nullable: true
    })
    permission: TourIntimationEnum;

    @Column({
        name: 'permission_date',
        nullable: true
    })
    permissionDate: Date;

    @Column('varchar', {
        name: "advance_required",
        length: 255,
        nullable: true,
    })
    advanceRequired: string

    @Column('varchar', {
        name: "requested_amount",
        length: 255,
        nullable: true,
    })
    requestedAmount: string

    @Column('json', { name: 'component_records', nullable: true })
    componentRecords: object; 

    @Column('enum', {
        name: 'tour_type',
        enum: TourTypeEnum,
        nullable: true
    })
    tourType: TourTypeEnum; 

    @Column('varchar', {
        name: "purpose_of_visit",
        length: 255,
        nullable: true,
    })
    purposeOfVisit: string

    @Column('tinyint', {
        nullable: false,
        default: 1,
        name: 'tour_claim',
    })
    tourClaim: boolean;


    @OneToMany((type) => TourDetailsEntity, (tour) => tour.tourId, { cascade: true })
    tourId: TourDetailsEntity[]

}