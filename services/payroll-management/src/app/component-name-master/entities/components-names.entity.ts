import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('component_names')
export class ComponentNamesEntity {

  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;
  
  @Column({ name: 'component_name', type: 'varchar', nullable: false })
  componentName: string;

  @Column({ name: 'component_name_code', type: 'varchar', nullable: true })
  componentNameCode: string;

  @Column({ name: 'type', type: 'varchar', nullable: true })
  type: string;

  @Column({ name: 'round_strg', type: 'varchar', nullable: true })
  roundStrg: string;
  
  @Column({ name: 'component_type', type: 'varchar', nullable: true })
  componentType: string;
  
  @Column({ name: 'is_derived', type: 'boolean', nullable: true })
  isDerived: boolean;
  
  // @Column({ name: 'derived_rule', type: 'boolean', nullable: true })
  // derivedRule: boolean;
  
  @Column({ name: 'cut_off_amount', type: 'boolean', nullable: true })
  cutOffAmount: boolean;

  @Column({ name: 'calculated_rule', type: 'boolean', nullable: true })
  calculatedRule: boolean;

  @Column({ name: 'is_active', type: 'boolean', nullable: true })
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

}