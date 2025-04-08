export class PayrollTypesReq {
    id?: number;
    name?: string;
    description?: Text;
    constructor(id?: number, name?: string, description?: Text) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

}