import { WhatsAppBroadCastRequest, BroadCastMessageRequest, GlobalResponseObject, WhatsAppLogDto, CommonResponseModel } from "@hrexpert/shared-models";
import axios from "axios";


export class WhatsappBroadCastService{

   whatsAppBroadCatURL = '';
   whatsappbiMessageURL = '';
  //  whatsAppBroadCatURL = 'http://localhost:3000/api/message-broadcast';
    async CallBroadCastApi(req:WhatsAppBroadCastRequest): Promise<CommonResponseModel> {
        return await axios.post(this.whatsAppBroadCatURL + '/saveBroadCastedMessageToMultipleCustomers',req)
          .then(res => {
            return res.data
          })
      }
    async sendWhatsappMessage(req: BroadCastMessageRequest): Promise<GlobalResponseObject> {
      console.log(this.whatsAppBroadCatURL)
        return await axios.post(this.whatsAppBroadCatURL + '/sendMessage', req)
            .then(res => {
              console.log(res)
                return res.data
            })
    }
    async createWhatappLog(req: WhatsAppLogDto): Promise<GlobalResponseObject> {

      console.log(this.whatsAppBroadCatURL)
        return await axios.post(this.whatsappbiMessageURL + '/createWhatappLog', req)
            .then(res => {
              console.log(res)
                return res.data
            })
    }
}