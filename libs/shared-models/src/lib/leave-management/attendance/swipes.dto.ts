export class AttendanceSwipesDto {
    employeeNumber: string;
    employeeName: string;
    cardNumber: string;
    swipeDate: string;
    swipeTime: string;
    branch: string;
    readerNumber: number;
    ip: string;
    inOut: 'IN' | 'OUT';
    downloadedDateTime: string;
    status: number;
}

export class CreateAttendanceSwipeResponse {
    message: string;
    statusCode: number;
    failedRecords?: Array<{ error: string; record: AttendanceSwipesDto }>;

    constructor(message:string, statusCode: number, failedRecords?: Array<{ error: string; record: AttendanceSwipesDto }>) {
        this.message = message;
        this.statusCode = statusCode;
        this.failedRecords = failedRecords;
    }
}
