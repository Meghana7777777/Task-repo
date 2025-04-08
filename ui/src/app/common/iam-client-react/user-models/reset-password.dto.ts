export class ResetPasswordDto {
    username: string;
    otp: string;
    newPassword: string;
    authServerUrl: string
    /**
     * 
     * @param username 
     * @param otp 
     * @param newPassword 
     * @param authServerUrl 
     */
    constructor(username: string, otp: string, newPassword: string, authServerUrl: string) {
        this.username = username;
        this.otp = otp;
        this.newPassword = newPassword;
        this.authServerUrl = authServerUrl;
    }
}
