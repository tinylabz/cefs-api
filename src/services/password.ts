import crypto from "crypto";
import util from "util";

export class Passwd {
  static async toHash(passwd: string): Promise<string> {
    const salt = crypto.randomBytes(8).toString("hex");
    const buffer = (await util.promisify(crypto.scrypt)(
      passwd,
      salt,
      64
    )) as Buffer;
    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(
    storedPasswd: string,
    suppliedPwd: string
  ): Promise<boolean> {
    const [hashedPasswd, salt] = storedPasswd.split(".");
    const buffer = (await util.promisify(crypto.scrypt)(
      suppliedPwd,
      salt,
      64
    )) as Buffer;
    return buffer.toString("hex") === hashedPasswd;
  }
}
