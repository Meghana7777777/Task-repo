export class AllUnitsResponseDto {
    constructor(
        public unitName: string,
        public applicationId: number,
        public clientId: number,
        public unitId: number,
        public name: string,
        public clientName: string
    ) {}
}
