
export class NotificationsReqModel {
    currentAssignee: string;
    role?: string;
    constructor(
        currentAssignee: string,
        role: string
    ) {
        this.currentAssignee = currentAssignee;
        this.role = role;
    }
}

export class NotificationStatusReqModal {
    woId: number;
    notificationStatus: string;
    currentAssignee: string;
    role?: string;
    constructor(
        woId: number,
        notificationStatus: string,
        currentAssignee: string,
        role?: string
    ) {
        this.woId = woId;
        this.notificationStatus = notificationStatus;
        this.currentAssignee = currentAssignee;
        this.role = role;
    }

}

export class OrderTypeModel {
    BULK: string;
    Sample: string;
}

export class FilteredDataReqModel {

    orderType: string;
    orderCategory: string;
    woNo: string[];
    item: [];
    orderStatus: [];
    season: string;
    merchant: string;
    fromDate: string;
    toDate: string;
    constructor(
        orderType?: string,
        orderCategory?: string,
        woNo?: [],
        item?: [],
        orderStatus?: [],
        season?: string,
        merchant?: string,
        fromDate?: string,
        toDate?:string,
    ) {
        this.orderType = orderType;
        this.orderCategory = orderCategory;
        this.woNo = woNo;
        this.item = item;
        this.orderStatus = orderStatus;
        this.season = season;
        this.merchant = merchant;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
}