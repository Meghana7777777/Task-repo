export class DropdownUsersDto {
    firstName: string;
    employeeId: string;
    employeeCode: string;
    // middleName: string;
    // lastName: string;
    usersId: number;
    constructor(
        firstName: string,
        employeeId: string,
    employeeCode: string,
        // middleName: string,
        // lastName: string,
        usersId: number,
    ) {
        this.firstName = firstName;
        this.employeeId = employeeId
        this.employeeCode = employeeCode;
        // this.middleName = middleName;
        // this.lastName = lastName;
        this.usersId = usersId;
    }

}