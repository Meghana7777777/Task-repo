import { ComponentsDto } from "./Components.dto";

export class WhatsAppMessageTemplateDto{
    name : string;
    language : {code : string}
    components : ComponentsDto
}