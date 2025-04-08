import { IsAllocatedEnum } from "@hrexpert/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('is-leave-allocated-logs')
export class IsLeaveAllocatedLogs {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'year', type: 'year', nullable: false })
    year: string;

    @Column({ name: 'month_year', type: 'varchar', nullable: false })
    monthYear: string;

    @Column({ name: 'is_allocated', type: 'enum', enum: IsAllocatedEnum, nullable: false })
    isAllocated: IsAllocatedEnum;

}
