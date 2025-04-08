export class DepartmentReq {
    id?: number;
    empId?: number;
    name?: string;
    code?: string
    hod?: string;
    constructor(id?: number, empId?: number, name?: string,code?: string, hod?: string) {
        this.id = id;
        this.empId = empId;
        this.name = name;
        this.code = code;
        this.hod = hod;
    }

}