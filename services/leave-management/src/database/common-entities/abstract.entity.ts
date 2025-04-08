import { Exclude } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Generated,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn({
        name: 'id'
    })
    // @Exclude()
    public id: number;

    @Column({
        name: 'uuid'
    })
    @Generated("uuid")
    public uuid: string;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column('boolean', {
        nullable: false,
        default: true,
        name: 'is_active',
    })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;


    @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'created_user'
    })
    createdUser: string | null;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'updated_user'
    })
    updatedUser: string | null;


    @VersionColumn({
        default: 1,
        name: 'version_flag'
    })
    versionFlag: number;

    @Column('text', { name: 'remarks', nullable: true })
    remarks: string;
}