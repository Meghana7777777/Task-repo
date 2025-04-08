import { CommonRequestAttrs } from "../ums-common";

 

export class ApplicationIdReqDto extends CommonRequestAttrs {
    applicationId: number;
    constructor(username: string, userId: number, applicationId: number) {
        super(username, userId);
        this.applicationId = applicationId;
    }
}