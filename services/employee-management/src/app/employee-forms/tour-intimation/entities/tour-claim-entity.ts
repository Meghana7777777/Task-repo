import { TourClaimEnum, TourIntimationEnum, TourTypeEnum } from "@hrexpert/shared-models";
import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity, OneToMany } from "typeorm";
import { TourDetailsEntity } from "./tour-details-entity";

@Entity('tour_claim')
export class TourClaimEntity extends AbstractEntity {

    @Column('int', { name: 'employee_id', nullable: true })
    employeeId: number

    @Column('int', { name: 'tour_intimation_id', nullable: true })
    tourIntimationId: number

    @Column('enum', {
        name: 'status',
        enum: TourClaimEnum,
        nullable: true
    })
    status: TourClaimEnum;

    @Column({
        name: 'permission_date',
        nullable: true
    })
    permissionDate: Date;

    @Column('varchar', {
        name: "advance_taken",
        length: 255,
        nullable: true,
    })
    advanceTaken: string

    @Column('varchar', {
        name: "amount_claimed",
        length: 255,
        nullable: true,
    })
    amountClaimed: string

    @Column('varchar', {
        name: "sanctioned_amount",
        length: 255,
        nullable: true,
    })
    sanctionedAmount: string

    @Column('varchar', {
        name: "balance_amount",
        length: 255,
        nullable: true,
    })
    balanceAmount: string


    @Column('varchar', {
        name: "tour_claim_pdf",
        length: 255,
        nullable: true,
    })
    tourClaimPdf: string

}