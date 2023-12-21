import * as crypto from "crypto";

export class UUID {
  constructor() {
    // The constructor can be used for any initialization if needed
  }

  static stringify(uuidBytes: Buffer): string {
    return uuidBytes
      .toString("hex")
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
  }

  // Generates a time-based version 8 UUID
  static generate(options?: { time?: Date }): string {
    const time = options && options.time ? options.time : new Date();

    const buf = Buffer.alloc(16);

    buf.writeUInt16BE(time.getUTCFullYear(), 0);
    buf.writeUInt8(time.getUTCMonth() + 1, 2); // Months are 0-indexed in JavaScript
    buf.writeUInt8(time.getUTCDate(), 3);
    buf.writeUInt8(time.getUTCHours(), 4);
    buf.writeUInt8(time.getUTCMinutes(), 5);
    buf.writeUInt8(time.getUTCSeconds(), 7);
    buf.writeUInt16BE(time.getUTCMilliseconds(), 8);

    if (crypto.getRandomValues) {
      const randomBytes = new Uint8Array(10);
      crypto.getRandomValues(randomBytes);
      Buffer.from(randomBytes).copy(buf, 6);
    } else {
      // Fallback to crypto.randomBytes if crypto.getRandomValues is not available
      crypto.randomBytes(10).copy(buf, 6);
    }

    // Manipulate bits according to version and variant requirements
    buf.writeUInt8((buf.readUInt8(6) & 0x0f) | 0x80, 6);
    buf.writeUInt8((buf.readUInt8(8) & 0x3f) | 0x80, 8);

    return UUID.stringify(buf);
  }

  static parse(uuidString: string): Uint8Array {
    const hexString = uuidString.replace(/-/g, ""); // Remove dashes from the UUID string
    const buf = Buffer.from(hexString, "hex");

    // Validate the length of the buffer
    if (buf.length !== 16) {
      throw new Error("Invalid UUID string");
    }

    return Uint8Array.from(buf);
  }

  parseToHex(uuidString: string): string[] {
    const bytes = UUID.parse(uuidString);
    return Array.from(bytes, (v) => v.toString(16).padStart(2, "0"));
  }

  validate(uuidString: string): boolean {
    try {
      const uuidBytes = UUID.parse(uuidString);
      if (uuidBytes) {
        if (!(uuidBytes instanceof Uint8Array) || uuidBytes.length !== 16) {
          return false;
        }

        const version = parseInt(uuidString.slice(14, 15), 16);
        if (version !== 8) {
          return false;
        }

        // Check the variant bits
        const variant = (uuidBytes[8] & 0xc0) >> 6;
        if (variant !== 2) {
          return false;
        }

        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }
}
export const uuidv8 = (): string => UUID.generate();
export const uuidv8obj = UUID;