
export class AttenCoOffDto {
   
   date?:string
   attnStatus?: string
   branch?: number
    constructor(
        date:string,
        attnStatus: string,
        branch: number
        
    ) {
        this.date =date
        this.attnStatus = attnStatus
        this.branch =branch
    }
}