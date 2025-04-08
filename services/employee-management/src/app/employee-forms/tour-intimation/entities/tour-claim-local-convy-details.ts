import { ModeOfTransportEnum } from "@hrexpert/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tc_localconvy')
export class TcLocalConvyDetailsEntity {

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

    @Column('enum', {
        name: 'transport_mode',
        enum: ModeOfTransportEnum,
        nullable: true
    })
    transportMode: ModeOfTransportEnum;

    @Column('varchar', {
        name: "rupees",
        length: 255,
        nullable: true,
    })
    rupees: string

  

   

}