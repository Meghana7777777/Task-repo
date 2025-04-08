export class SpaceValidators {
    public getValue(value: object, defaultValue: any): any {
        if (value) {
            Object.keys(value).map(k => value[k] = typeof value[k] == 'string' ? value[k].trim() : value[k]);
            return value;
        } else {
            return defaultValue;
        }
    } 
}
