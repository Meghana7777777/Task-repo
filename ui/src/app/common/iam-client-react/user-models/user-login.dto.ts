export class LoginUserDto {
  username: string;
  password: string;
  authServerUrl: string
  
  /**
   * 
   * @param username 
   * @param password 
   * @param authServerUrl 
   */
  constructor(username: string, password: string,authServerUrl:string) {
    this.username = username;
    this.password = password;
    this.authServerUrl = authServerUrl;
  }
}