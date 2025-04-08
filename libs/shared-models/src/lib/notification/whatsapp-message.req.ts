

export class MessageParameters{
    recepient : string;
    template : string;
    parameters : any
    languageCode ? : string
    buttonParameter?:string
    constructor (recepient:string,template:string, parameters :any,languageCode?:string,buttonParameter?:string) {
        this.recepient = recepient;
        this.template = template;
        this.parameters = parameters;
        this.languageCode = languageCode
        this.buttonParameter = buttonParameter
    }
}
