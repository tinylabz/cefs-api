import crypto from "node:crypto";
import util from "node:util";

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

  static async compare(stored: string, supplied: string): Promise<boolean> {
    const [hash, salt] = stored.split(".");
    const buffer = (await util.promisify(crypto.scrypt)(
      supplied,
      salt,
      64
    )) as Buffer;
    return buffer.toString("hex") === hash;
  }
}
