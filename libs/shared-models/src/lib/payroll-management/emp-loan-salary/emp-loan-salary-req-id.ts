export class EmpLoanSalarySharedIdDto {

    id: number
    constructor(id: number,) {
      this.id = id;
    }
  
  }  


  export class empLoanSalaryIdDto {
    employeeId?: number;
    id?: number
    constructor(employeeId?: number, id?: number) {
      this.employeeId = employeeId;
      this.id = id
    }
  }