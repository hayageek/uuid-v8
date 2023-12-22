import { expect } from 'chai';
import { UUID, uuidv8 } from  "uuid-v8";

describe('UUID Module', () => {
  describe('UUID.generate', () => {
    it('should generate a valid version 8 UUID string', () => {
      const uuid = UUID.generate();
      expect(UUID.validate(uuid)).to.be.true;
    });

    it('should generate a valid version 8 UUID for a specific time', () => {
      const specificTime = new Date('2023-01-01T12:34:56.789Z');
      const uuid = UUID.generate({ time: specificTime });
      const extractedTime = UUID.getTime(uuid);

      expect(extractedTime.toISOString()).to.equal(specificTime.toISOString());
    });
  });

  describe('UUID.parse', () => {
    it('should parse a valid version 8 UUID string', () => {
      const uuidString = uuidv8();
      const uuidBytes = UUID.parse(uuidString);

      expect(uuidBytes).to.be.instanceOf(Uint8Array);
      expect(uuidBytes.length).to.equal(16);
    });

    it('should throw an error for an invalid UUID string', () => {
      const invalidUuidString = 'invalid-uuid';
      expect(() => UUID.parse(invalidUuidString)).to.throw('Invalid UUID string');
    });
  });

  describe('UUID.getTime', () => {
    it('should extract the correct timestamp from a version 8 UUID string', () => {
      const specificTime = new Date('2023-01-01T12:34:56.789Z');
      const uuid = UUID.generate({ time: specificTime });
      const extractedTime = UUID.getTime(uuid);

      expect(extractedTime.toISOString()).to.equal(specificTime.toISOString());
    });
  });

  describe('UUID.parseToHex', () => {
    it('should parse a UUID string to an array of hexadecimal strings', () => {
      const uuidString = uuidv8();
      const hexArray = UUID.parseToHex(uuidString);
      expect(hexArray).to.be.an('array');
      expect(hexArray.join('').length).to.equal(32); // Each byte represented by 2 hex characters
    });
  });

  describe('UUID.validate', () => {
    it('should return true for a valid version 8 UUID string', () => {
      const validUuidString = uuidv8();
      expect(UUID.validate(validUuidString)).to.be.true;
    });

    it('should return false for an invalid version 8 UUID string', () => {
      const invalidUuidString = 'invalid-uuid';
      expect(UUID.validate(invalidUuidString)).to.be.false;
    });
  });
});
