export class FileUploadIdModel {
    fileUploadId: string;
    plantCode: string;
    createdUser: string
    constructor(fileUploadId: string, plantCode: string, createdUser: string) {
        this.fileUploadId = fileUploadId
        this.plantCode = plantCode;
        this.createdUser = createdUser;
    }
}