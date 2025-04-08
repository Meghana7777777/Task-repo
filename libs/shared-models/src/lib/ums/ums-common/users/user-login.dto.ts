export class LoginUserDto {
  username: string;
  password: string;
  
  /**
   * 
   * @param username 
   * @param password 
   */
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}