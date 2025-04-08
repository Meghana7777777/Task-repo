import { MessageParameters, MessageRequest, MessageResponse } from "@hrexpert/shared-models";
import { WhatsUpCommonAxiosService } from "./common-axios-service-whatup";
import axios from "axios";
import { whatsApp } from '../../../../../services/whatsApp/watsapp'

export class WhatsUpService extends WhatsUpCommonAxiosService {

    private whatsAppController = "/apply-ot";


    async sendPersonalMessage(message: MessageRequest): Promise<MessageResponse> {
        return this.axiosPostCall(this.whatsAppController + '/sendPersonalMessage', message).then((res) => {
            return res.data;
        });
    }

    async sendGroupMessage(message: MessageRequest): Promise<MessageResponse> {
        return this. axiosPostCall(this.whatsAppController + '/sendGroupMessage', message).then((res) => {
            return res.data;
        });
    }

    async sendMessageThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return await axios.post(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    // {
                    //     "type": "header",
                    //     "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    // },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    }
                    
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return new MessageResponse(true,'success');
        }).catch(err => { return new MessageResponse(false,err) });
    }

    async sendMessageWithHeaderThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return this. axiosPostCall(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    {
                        "type": "header",
                        "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    }
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return res.data;
        }).catch(err => { return err });
    }

    async sendMessageWithButtonThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return this. axiosPostCall(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    // {
                    //     "type": "header",
                    //     "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    // },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    },
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return res.data;
        }).catch(err => { return err });
    }

    async sendMessageWithButtonParamsThroughFbApi(message: MessageParameters): Promise<MessageResponse> {
        return this. axiosPostCall(`https://graph.facebook.com/${whatsApp.VERSION}/${whatsApp.PHONE_NUMBER_ID}/messages`, {
            "messaging_product": "whatsapp",
            "to": message.recepient,
            "type": "template",
            "template": {
                "name": message.template,
                "language": {
                    "code": message.languageCode ? message.languageCode : "en_us"
                },
                "components": [
                    // {
                    //     "type": "header",
                    //     "parameters": [{ "type": "text", "text": "Sandhya Aqua" }]
                    // },
                    {
                        "type": "body",
                        "parameters": message.parameters,

                    }, 
                    {
                        "type": "button",
                        "sub_type" : "url",
                        "index": "0", 
                        "parameters": [
                            {
                                "type": "text",
                                "text":message.buttonParameter
                            }
                        ]
                    },
                ]
            }
        }, {
            "headers": {
                'Authorization': `Bearer ${whatsApp.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            return res.data;
        }).catch(err => { return err });
    }
    
    async kmkHrmsCommonTemplete(phnNo: number, body: any, templateName: string) {
        try {
            const textMessagePayload =  {
                "messaging_product": "whatsapp",
                "to": phnNo,
                "type": "template",
                "template": {
                    "name": templateName,
                    "language": {
                        "code": "en"
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": body
                                }
                            ]
                        }
                    ]
                }
            }
            console.log('Payload:', JSON.stringify(textMessagePayload, null, 2));
    
          return await axios.post(
                'https://graph.facebook.com/v19.0/437711296082941/messages',
                textMessagePayload,
                {
                    headers: {
                        Authorization: `Bearer EAAPlWQYnjvkBO3nJuYbGL6Afc6AKwCt3wz4vp4LD6XSMAWwQkgOeCaDcObuHzbkW4z8QSXUZCO1CvMzVCZBTAtpTZA0sIinwZCPcKBiZCQf4YukEAQ9LB5a6ofpQO4oSmGbBZCzRq2T2GRPYZCo3BAguGhmv9NfrZAaFOZByNUVjoVRExpG2SgROsinlVIM5FJzqUehtG3QfjHeLW7MXM`
                    }
                }
            ).then(res=>res)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.log("Error while executing [sendingDetails]:", error.message);
                if (error.response) {
                    console.log(`HTTP Status: ${error.response.status}`);
                    console.log(`Response data: ${JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    console.log("No response received:", error.request);
                } else {
                    console.log("Error while setting up the request:", error.message);
                }
            } else {
                console.log("Unexpected error:", error);
            }
        }
    }


    
    async newEmployeeCreatedWhatsappTemplate(phnNo: number, body: any, templateName: string) {
        try {
            const cleanedBody = body.replace(/[\n\t]+/g, ' ').replace(/ {5,}/g, '    ');
            const textMessagePayload =  {
                "messaging_product": "whatsapp",
                "to": phnNo,
                "type": "template",
                "template": {
                    "name": templateName,
                    "language": {
                        "code": "en_us"
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": cleanedBody
                                }
                            ]
                        }
                    ]
                }
            }
            console.log('Payload:', JSON.stringify(textMessagePayload, null, 2));
    
          return await axios.post(
                'https://graph.facebook.com/v19.0/437711296082941/messages',
                textMessagePayload,
                {
                    headers: {
                        Authorization: `Bearer EAAPlWQYnjvkBO3nJuYbGL6Afc6AKwCt3wz4vp4LD6XSMAWwQkgOeCaDcObuHzbkW4z8QSXUZCO1CvMzVCZBTAtpTZA0sIinwZCPcKBiZCQf4YukEAQ9LB5a6ofpQO4oSmGbBZCzRq2T2GRPYZCo3BAguGhmv9NfrZAaFOZByNUVjoVRExpG2SgROsinlVIM5FJzqUehtG3QfjHeLW7MXM`
                    }
                }
            ).then(res=>res)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.log("Error while executing [sendingDetails]:", error.message);
                if (error.response) {
                    console.log(`HTTP Status: ${error.response.status}`);
                    console.log(`Response data: ${JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    console.log("No response received:", error.request);
                } else {
                    console.log("Error while setting up the request:", error.message);
                }
            } else {
                console.log("Unexpected error:", error);
            }
        }
    }
    
    async aabsentLeaveStatusWhatsappApi(phnNo: number, body: any, templateName: string) {
        try {
            const cleanedBody = body.replace(/[\n\t]+/g, ' ').replace(/ {5,}/g, '    ');
            const textMessagePayload =  {
                "messaging_product": "whatsapp",
                "to": phnNo,
                "type": "template",
                "template": {
                    "name": templateName,
                    "language": {
                        "code": "en_us"
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": cleanedBody
                                }
                            ]
                        }
                    ]
                }
            }
            console.log('Payload:', JSON.stringify(textMessagePayload, null, 2));
    
          return await axios.post(
                'https://graph.facebook.com/v19.0/437711296082941/messages',
                textMessagePayload,
                {
                    headers: {
                        Authorization: `Bearer EAAPlWQYnjvkBO3nJuYbGL6Afc6AKwCt3wz4vp4LD6XSMAWwQkgOeCaDcObuHzbkW4z8QSXUZCO1CvMzVCZBTAtpTZA0sIinwZCPcKBiZCQf4YukEAQ9LB5a6ofpQO4oSmGbBZCzRq2T2GRPYZCo3BAguGhmv9NfrZAaFOZByNUVjoVRExpG2SgROsinlVIM5FJzqUehtG3QfjHeLW7MXM`
                    }
                }
            ).then(res=>res)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.log("Error while executing [sendingDetails]:", error.message);
                if (error.response) {
                    console.log(`HTTP Status: ${error.response.status}`);
                    console.log(`Response data: ${JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    console.log("No response received:", error.request);
                } else {
                    console.log("Error while setting up the request:", error.message);
                }
            } else {
                console.log("Unexpected error:", error);
            }
        }
    }
    
    
}