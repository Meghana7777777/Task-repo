import { AbstractEntity } from 'services/employee-management/src/database/common-entities';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('prefix_configuration')
export class PrefixConfiguration extends AbstractEntity {
  

  @Column({type:'int', name:'employee_type_id',nullable:false})
  employeeTypeId: number;

  @Column({type:'varchar',name:'selected_fields'})
  selectedFields: string; // Stored as a comma-separated string in MySQL

  @Column({type:'varchar',name:'customfield_text',nullable:true})
  customFieldText: string;

  @Column({type:'json',name:'field_positions'})
  fieldPositions: Record<string, number>; // Stored as JSON, compatible with MySQL 5.7+ and later

  @Column({ type: 'varchar', length: 255,name:'sample_code_preview',nullable:true })
  sampleCodePreview: string; // Optional column to store the generated sample code preview


}
