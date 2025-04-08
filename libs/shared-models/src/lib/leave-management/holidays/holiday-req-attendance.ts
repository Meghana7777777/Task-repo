export class HolidayReqForGenerateSwipe {
    branchId: number;
    date: string;

    constructor(branchId: number,date:string) {
        this.branchId = branchId;
        this.date = date;
    }

}