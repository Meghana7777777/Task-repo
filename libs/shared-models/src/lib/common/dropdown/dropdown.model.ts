export class DropdownModel {
    label : string;
    value  : number | string;
    
    constructor(label: string, value: number | string) {
        this.label = label;
        this.value = value;
    }
}