
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('week_off_leaves')
export class WeekOffLeaves extends AbstractEntity{
    
   
    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'week_name'
    })
    weekName: string;
    @Column("varchar", {
        nullable: true,
        length: 12,
        name: "employee_id"
      })
      
      employeeId: number;
    

    // @Column("varchar", {
    //     nullable: true,
    //     length: 12,
    //     name: "employee_code"
    //   })
      
    //   employeeCode: string;
    
    //   @Column("varchar", {
    //     length: 50,
    //     name: "employee_name"
    //   })
    //   employeeName: string;

   
}