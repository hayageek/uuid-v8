"use strict";
/// V8() Generates a time-based version 8 UUID
///
/// By default it will generate a string based off current time in Unix Epoch,
/// and will return a string.
///
/// The first argument is an options map that takes various configuration
/// options detailed in the readme.
///
/// https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format#section-4.3
///
///   0                   10                  20                  30
///   0 1 2 3 4 5 6 7 8 9 A B C D E F 0 1 2 3 4 5 6 7 8 9 A B C D E F
///  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
///  |                        year-month-day                         |
///  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
///  |          hour:minute          |  ver  | rand  |    seconds    |
///  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
///  |var| milliseconds  |                   rand                    |
///  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
///  |                             rand                              |
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidv8 = exports.UUID = void 0;
const crypto = __importStar(require("crypto"));
class UUID {
    static stringify(uuidBytes) {
        return uuidBytes
            .toString("hex")
            .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
    }
    // Generates a time-based version 8 UUID
    static generate(options) {
        const time = options && options.time ? options.time : new Date();
        const buf = Buffer.alloc(16);
        if (crypto.getRandomValues) {
            const randomBytes = new Uint8Array(10);
            crypto.getRandomValues(randomBytes);
            Buffer.from(randomBytes).copy(buf, 6);
        }
        else {
            // Fallback to crypto.randomBytes if crypto.getRandomValues is not available
            crypto.randomBytes(10).copy(buf, 6);
        }
        buf.writeUInt16BE(time.getUTCFullYear(), 0);
        buf.writeUInt8(time.getUTCMonth() + 1, 2); // Months are 0-indexed in JavaScript
        buf.writeUInt8(time.getUTCDate(), 3);
        buf.writeUInt8(time.getUTCHours(), 4);
        buf.writeUInt8(time.getUTCMinutes(), 5);
        buf.writeUInt8(time.getUTCSeconds(), 7);
        buf.writeUInt16BE(time.getUTCMilliseconds(), 8);
        // Manipulate bits according to version and variant requirements
        buf.writeUInt8((buf.readUInt8(6) & 0x0f) | 0x80, 6);
        buf.writeUInt8(buf.readUInt8(8) | (8 << 4), 8);
        //buf.writeUInt8((buf.readUInt8(8) & 0x3f) | 0x80, 8);
        return UUID.stringify(buf);
    }
    static parse(uuidString) {
        const hexString = uuidString.replace(/-/g, ""); // Remove dashes from the UUID string
        const buf = Buffer.from(hexString, "hex");
        // Validate the length of the buffer
        if (buf.length !== 16) {
            throw new Error("Invalid UUID string");
        }
        return Uint8Array.from(buf);
    }
    static getTime(uuidString) {
        const hexString = uuidString.replace(/-/g, '');
        const buf = Buffer.from(hexString, 'hex');
        const year = buf.readUInt16BE(0);
        const month = buf.readUInt8(2) - 1; // Months are 0-indexed in JavaScript
        const day = buf.readUInt8(3);
        const hours = buf.readUInt8(4);
        const minutes = buf.readUInt8(5);
        const seconds = buf.readUInt8(7);
        const milliseconds = buf.readUInt16BE(8) & 0x0fff;
        return new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
    }
    static parseToHex(uuidString) {
        const bytes = UUID.parse(uuidString);
        return Array.from(bytes, (v) => v.toString(16).padStart(2, "0"));
    }
    static validate(uuidString) {
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
                const variant = (uuidBytes[8] & 0xc0) >> 4;
                if (variant !== 8) {
                    return false;
                }
                return true;
            }
        }
        catch (error) {
            return false;
        }
        return false;
    }
}
exports.UUID = UUID;
const uuidv8 = () => UUID.generate();
exports.uuidv8 = uuidv8;
