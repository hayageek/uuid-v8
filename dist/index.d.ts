/// <reference types="node" resolution-mode="require"/>
export declare class UUID {
    static stringify(uuidBytes: Buffer): string;
    static generate(options?: {
        time?: Date;
    }): string;
    static parse(uuidString: string): Uint8Array;
    static getTime(uuidString: string): Date;
    static parseToHex(uuidString: string): string[];
    static validate(uuidString: string): boolean;
}
export declare const uuidv8: () => string;
