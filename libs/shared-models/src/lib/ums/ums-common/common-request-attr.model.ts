export class CommonRequestAttrs {
    username: string;
    userId: number;
    constructor(username: string, userId: number) {
        this.username = username;
        this.userId = userId;
    }
}