import { ModeOfTransportEnum } from "@hrexpert/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tc_fare')
export class TcFareDetailsEntity {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    public id: number;

    @Column('int', { name: 'tour_claim_id', nullable: true })
    tourClaimId: number

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

    @Column('enum', {
        name: 'transport_mode',
        enum: ModeOfTransportEnum,
        nullable: true
    })
    transportMode: ModeOfTransportEnum;

    @Column('varchar', {
        name: "fare_rupees",
        length: 255,
        nullable: true,
    })
    fareRupees: string

  

   

}