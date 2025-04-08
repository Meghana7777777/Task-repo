import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { SkillsReq } from "./skills-req.dto";

export class SkillsResponseModel extends GlobalResponseObject {
    data? : SkillsReq[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: SkillsReq[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}