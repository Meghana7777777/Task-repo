import { ComponentTypeEnum, RoundStrgEnum, TypeEnum } from "../../enums";

export class PayrollComponentsFormReq {
    id?: number;
    componentName?: string;
    columnName?: string;
    columnOrder?: number;
    isDerived?: boolean;
    derivedRule?: boolean;
    roundStrg?: RoundStrgEnum;
    calculatedRule?: Text;
    effDate?: string;
    type?: TypeEnum;
    componentType?: ComponentTypeEnum;
    isPfEarning?: boolean;
    isEsiEarning?: boolean;
    constructor(id?: number,
        componentName?: string,
        columnName?: string,
        columnOrder?: number,
        isDerived?: boolean,
        derivedRule?: boolean,
        roundStrg?: RoundStrgEnum,
        calculatedRule?: Text,
        effDate?: string,
        type?: TypeEnum,
        componentType?: ComponentTypeEnum,
        isPfEarning?: boolean,
        isEsiEarning?: boolean,
    ) {
        this.id = id;
        this.componentName = componentName;
        this.columnName = columnName;
        this.columnOrder = columnOrder;
        this.isDerived = isDerived;
        this.derivedRule = derivedRule;
        this.roundStrg = roundStrg;
        this.calculatedRule = calculatedRule;
        this.effDate = effDate;
        this.type = type;
        this.componentType = componentType;
        this.isPfEarning = isPfEarning;
        this.isEsiEarning = isEsiEarning;
    }

}