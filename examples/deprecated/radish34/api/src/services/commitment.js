import { concatenateThenHash } from '../utils/crypto/hashes/sha256/sha256';
import { rndHex } from '../utils/crypto/conversions';
import { getSiblingPath } from './merkle-tree';
import { Element, elementify } from '../utils/crypto/format-inputs';

// convenience 'reader-friendly' functions for checking if objects are empty:
export const countNestedKeys = (obj, counter = 0) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      counter = countNestedKeys(obj[key], counter); // eslint-disable-line no-param-reassign
    } else if (!(typeof obj[key] === 'undefined' || obj[key] === '' || obj[key] === 'null')) {
      counter++; // eslint-disable-line no-plusplus, no-param-reassign
    }
  });
  return counter;
};

/**
This validates that the objects contain all mandatory keys, required for an MSA.
'commitment' object should all contain these keys, if passed into the Commitment constructor.
*/
const validate = (object, objectType) => {
  // validate objects' keys:
  const requiredKeys = (type => {
    switch (type) {
      case 'commitment':
        return ['commitment', 'salt'];
      default:
        throw new Error('object type not recognised.');
    }
  })(objectType);

  const missingKeys = requiredKeys.filter(key => !(key in object));

  if (missingKeys.length > 0)
    throw new Error(`missing required keys for Commitment object ${objectType}: ${missingKeys}`);
};

export class Commitment {
  constructor(preimage, commitment, initType) {
    switch (initType) {
      case 'preimage':
        // Generate a new commitment from preimage.
        // The commitment parameter is not used.
        const salt = rndHex(32); // eslint-disable-line no-case-declarations
        this._preimage = { ...preimage, salt };

        this._commitment = concatenateThenHash(...Object.values(this._preimage));
        this._salt = salt;
        break;

      case 'commitment':
        // Generate a new commitment from the input commitment object.
        validate(commitment, 'commitment');
        this._commitment = commitment.commitment;
        this._index = commitment.index;
        this._salt = commitment.salt;
        this._preimage = commitment.preimage;
        break;

      default:
        throw new Error('commitment initialisation type not recognised');
    }
  }

  get commitment() {
    return new Element(this._commitment, 'hex');
  }

  get index() {
    return new Element(this._index, 'integer');
  }

  get salt() {
    return new Element(this._salt, 'hex');
  }

  get preimage() {
    return this._preimage;
  }

  get nullifier() {
    return new Element(concatenateThenHash(this.commitment.hex(64), this.salt.hex(64)), 'hex');
  }

  // NEED TO AWAIT THIS, because getSiblingPath is async
  get siblingPath() {
    if (this._index === undefined) {
      return null; // the commitment hasn't been added to the tree, so there's no siblingPath to get
    }
    return getSiblingPath('Shield', this._commitment, this._index);
  }

  get object() {
    return {
      commitment: this._commitment,
      ...(this._index !== undefined && { index: this._index }),
      salt: this._salt,
      nullifier: this.nullifier.hex(),
    };
  }

  // we need to be able to set the index, after the commitment has been added to the merkle tree.
  set index(i) {
    if (!(this._index === undefined))
      throw new Error(`Conflict. index already set as ${this._index}.`);
    this._index = i;
  }
}

export { Commitment as default };
