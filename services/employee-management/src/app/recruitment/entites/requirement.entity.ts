import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('recruitment')
  export class RecruitmentEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column('varchar', { name: 'company', length: 255 })
    company: string;
    @Column('varchar', { name: 'job_role', length: 255 })
    jobRole: string;

    @Column('text', { name: 'job_description',  })
    jobDescription: string;
  
    @Column({ name: 'notification_date', type: 'date',  })
    notificationDate: Date;
  
    @Column({ name: 'resource_required', type: 'int',  })
    resourceRequired: number;
  
    @Column('varchar', { name: 'technology', length: 255,  })
    technology: string;
  
    @Column({ name: 'planning_closing_date', type: 'date',  })
    planningClosingDate: Date;
  
    @Column('varchar', { name: 'billing_rate', length: 255,  })
    billingRate: string;
  
    @Column('varchar', { name: 'approx_experience', length: 255,  })
    approxExperience: string;
  
    @Column('varchar', { name: 'min_project_duration', length: 255,  })
    minProjectDuration: string;
  
    @Column('boolean', { name: 'expenses_paid_by_client', default: false })
    expensesPaidByClient: boolean;
  
    @Column('varchar', { name: 'status', length: 50,  })
    status: string;
  
    @Column('text', { name: 'remarks',  })
    remarks: string;
  
    @Column('varchar', { name: 'job_location', length: 255,  })
    jobLocation: string;
  
    @Column('varchar', { name: 'created_user', length: 255, nullable: true })
    createdUser: string;
  
    @Column('varchar', { name: 'updated_user', length: 255, nullable: true })
    updatedUser: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
  
    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;
  
    @Column({ name: 'version_flag', type: 'int', default: 1 })
    versionFlag: number;
  }
  