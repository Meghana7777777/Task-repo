import { message } from "antd"

export class AlertMessages {
    static getInfoMessage(arg0: string) {
        throw new Error('Method not implemented.');
    }
    static getErrorMessage = (content?: string) => {
        message.error({content}, 10);
        return false;
    }

    static getSuccessMessage = (content?: string) => {
        message.success({content}, 10);
        return false;
    }
}