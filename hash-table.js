const sha256 = require("js-sha256");

class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {
  constructor(numBuckets = 4) {
    this.count = 0;
    this.capacity = numBuckets;
    this.data = new Array(this.capacity).fill(null);
  }

  hash(key) {
    const first8 = sha256(key).slice(0, 8);
    return parseInt(`0x${first8}`);
  }

  hashMod(key) {
    return this.hash(key) % this.capacity;
  }

  insertNoCollisions(key, value) {
    const index = this.hashMod(key);
    if (!this.data[index]) {
      this.data[index] = new KeyValuePair(key, value);
      this.count++;
    } else {
      throw Error("hash collision or same key/value pair already exists!");
    }
  }

  insertWithHashCollisions(key, value) {
    const index = this.hashMod(key);
    const newPair = new KeyValuePair(key, value);
    if (!this.data[index]) {
      this.data[index] = newPair;
    } else {
      newPair.next = this.data[index];
      this.data[index] = newPair;
    }
    this.count++;
  }

  insert(key, value) {
    const index = this.hashMod(key);
    let curr = this.data[index];
    while (curr && curr.key !== key) {
      curr = curr.next;
    }
    if (curr) {
      curr.value = value;
    } else {
      const newPair = new KeyValuePair(key, value);
      if (!this.data[index]) {
        this.data[index] = newPair;
      } else {
        newPair.next = this.data[index];
        this.data[index] = newPair;
      }
      this.count++;
    }
  }
}

module.exports = HashTable;
//test
