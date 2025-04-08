import { ModeOfTransportEnum } from "@hrexpert/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tc_otherexpenses')
export class TcOtherExpDetailsEntity {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    public id: number;

    @Column('int', { name: 'tour_claim_id', nullable: true })
    tourClaimId: number

    @Column('varchar', {
        name: "date",
        nullable: true,
    })
    date: string

    @Column('varchar', {
        name: "nature_of_expenses",
        length: 255,
        nullable: true,
    })
    natureOfExpenses: string

    @Column('varchar', {
        name: "rupees",
        length: 255,
        nullable: true,
    })
    rupees: string   

}