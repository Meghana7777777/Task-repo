import { AbstractEntity } from "services/employee-management/src/database/common-entities/abstract.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('employee_asset_mapping')
export class EmpAssetMappingEntity {

    @PrimaryGeneratedColumn({ name: 'employee_asset_id' })
    employeeAssetId: number;

    @Column({ type: 'int', nullable: false, name: 'employee_id' })
    employeeId: number;

    @Column({ type: 'int', nullable: false, name: 'asset_id' })
    assetId: string;

    @Column({ type: 'timestamp', nullable: false, name: 'issued_date', default: () => 'CURRENT_TIMESTAMP' })
    issuedDate: Date;

    @Column({ type: 'timestamp', name: 'return_date' })
    returnDate: Date;

    @Column({ type: 'varchar', length: 50, nullable: false, name: 'branch' })
    branch: string;

    @Column({ type: 'varchar', length: 50, nullable: false, name: 'asset_status' })
    assetStatus: string;

    @Column({ type: 'text', nullable: true, name: 'remarks' })
    remarks: string;

    @Column({ type: 'boolean', nullable: false, name: 'is_active' })
    isActive: boolean;
}
