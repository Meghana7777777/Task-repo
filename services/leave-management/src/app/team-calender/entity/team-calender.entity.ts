import { Column, Entity, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('team_calender')
export class TeamCalender {

    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;

    @Column('varchar', {
        nullable: false,
        length: 50,
        name: 'shift_code'
    })
    shiftCode: string;

    @Column('datetime', {
        name: 'from_date'
    })
    fromDate: Date;

    @Column('datetime', {
        name: 'to_date'
    })
    toDate: Date;

    @Column('int', {
        nullable: false,
        name: 'shift'
    })
    shift: number;

    @Column('boolean', {
        nullable: false,
        default: true,
        name: 'is_active'
    })
    isActive: boolean;

    @CreateDateColumn({
        name: 'created_at',
        type: 'datetime'
    })
    createdAt: Date;

    @Column('varchar', {
        nullable: true,
        name: 'created_user'
    })
    createdUser: string | null;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'datetime'
    })
    updatedAt: Date;

    @Column('varchar', {
        nullable: true,
        name: 'updated_user'
    })
    updatedUser: string | null;

    @VersionColumn({
        default: 1,
        name: 'version_flag'
    })
    versionFlag: number;
}