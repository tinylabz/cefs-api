import crypto from "crypto";
import util from "util";

export class PasswordVault {
  static async toHash(password: string): Promise<string> {
    const salt = crypto.randomBytes(8).toString("hex");
    const buffer = (await util.promisify(crypto.scrypt)(
      password,
      salt,
      64
    )) as Buffer;
    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buffer = (await util.promisify(crypto.scrypt)(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    return buffer.toString("hex") === hashedPassword;
  }
}
