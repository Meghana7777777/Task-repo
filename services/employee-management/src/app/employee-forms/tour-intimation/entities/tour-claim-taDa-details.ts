import { ModeOfTransportEnum } from "@hrexpert/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tc_tada')
export class TcTaDaDetailsEntity {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    public id: number;

    @Column('int', { name: 'tour_claim_id', nullable: true })
    tourClaimId: number

    @Column('varchar', {
        name: "lodging_details",
        length: 255,
        nullable: true,
    })
    lodgingDetails: string

    @Column('varchar', {
        name: "food_expenses",
        length: 255,
        nullable: true,
    })
    foodExpenses: string

    @Column('varchar', {
        name: "bill",
        length: 255,
        nullable: true,
    })
    bill: string

    @Column('varchar', {
        name: "date",
        nullable: true,
    })
    date: string

    @Column('varchar', {
        name: "tada_rupees",
        length: 255,
        nullable: true,
    })
    tadaRupees: string

}