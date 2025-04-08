import { ScopesEnum } from "libs/shared-models/src/lib/enums/scops-enum";


export class SequenceUtils {

    static convertNoSequence(cutNo: string) {
        return ('000' + cutNo).slice(-3)
    }

    static formatNumberToSpecificLength(number: string, length?: number) {
        if (!length)
            length = 4
        let r = "" + number;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }



    static globalFilter(searchedValue: string | number | boolean, record: any): boolean {
        const values = Object.keys(record).map((keys) => {
            return String(record[keys]).toLocaleLowerCase().includes(searchedValue.toLocaleString())
        })
        const removeDuplicates = new Set(values);
        if (removeDuplicates.size && removeDuplicates.has(true)) return true
        else return false;
    };


    static fetchViewAccessScopes(scopes: ScopesEnum[], scope: ScopesEnum) {
        if (scopes.includes(scope)) {
            return ''
        } else {
            return 'none'
        }
    }

    static fetchVisibleAccessScopes(scopes: ScopesEnum[], scope: ScopesEnum): boolean {
        return !scopes.includes(scope)
    }

}





