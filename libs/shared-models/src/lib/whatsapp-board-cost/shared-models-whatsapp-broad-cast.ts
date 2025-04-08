import { WhatsappPriorityEnum, WhatsAppMsgTypeEnum } from "../enums";


export class WhatsAppBroadCastRequest{
    companyId: number;
    priority: WhatsappPriorityEnum;
	messageType: WhatsAppMsgTypeEnum;
    message: string;
    contacts: string[];
    image ?:string;
}