import * as bcrypt from "bcrypt";

export class AuthenticationProvider {
  static async generateHash(password: string): Promise<string[]> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return [hashedPassword, salt]
  }
}