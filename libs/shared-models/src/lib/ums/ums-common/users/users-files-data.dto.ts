export class UsersFileUploadDataDto {

    fileName: string;
    originalName: string;
    lastModified: string;
    lastModifiedDate: string;
    percent: string;
    filePath: string;
    versionFlag: number;

    constructor(
        fileName: string,
        originalName: string,
        lastModified: string,
        lastModifiedDate: string,
        percent: string,
        filePath: string,
        versionFlag: number

    ) {

        this.fileName = fileName
        this.originalName = originalName
        this.lastModified = lastModified
        this.lastModifiedDate = lastModifiedDate
        this.percent = percent
        this.filePath = filePath
        this.versionFlag = versionFlag
    }

}