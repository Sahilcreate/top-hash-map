import LinkedList from "./linked-list.js";
import Node from "./node.js";

export default class HashMap {
  constructor(size = 16) {
    // set the map size
    this.size = size;
    this.loadSize = 0.75;
    this.bucket = new Array(this.size).fill(null);
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;

    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);

      // applying modulo on each iteration with hash size
      hashCode = hashCode % this.size;
    }

    return hashCode;
  }

  resizeHashMap() {
    this.size = this.size * 2;

    let oldBucket = this.bucket;
    this.bucket = new Array(this.size).fill(null);

    for (let i = 0; i < oldBucket.length; i++) {
      let bucketList = oldBucket[i];

      if (bucketList !== null) {
        let listHead = bucketList.listHead;

        while (listHead !== null) {
          this.set(listHead.key, listHead.value);
          listHead = listHead.nextNode;
        }
      }
    }
    this.checkBucketSize();
  }

  checkBucketSize() {
    let spaceOccupied = 0;

    for (let i = 0; i < this.bucket.length; i++) {
      const bucketItem = this.bucket[i];
      if (bucketItem) {
        spaceOccupied += 1;
      }
    }

    if (spaceOccupied / this.bucket.length >= this.loadSize) {
      this.resizeHashMap();
    }
  }

  set(key, value) {
    //const hashCode = hash the key
    //if (hashCode exists & key exist in linkedList)
    //  then replace the old value with new one
    //else if (hashCode exists & key doesn't exist in linkedList)
    //  link the node to end of linkedList
    //else if (no hashCode exist)
    //  if (loadFactor exceeds)
    //    resize the hashMap
    //  else
    //    new linkedList with listHead as {key, value} pair

    const index = this.hash(key);

    if (index < 0 || index >= this.bucket.length) {
      throw new Error("Trying to access index out of bound");
    }

    if (this.bucket[index]) {
      if (this.bucket[index].containsKey(key)) {
        this.bucket[index].replaceValue(key, value);
      } else {
        this.bucket[index].append(key, value);
      }
    } else {
      this.bucket[index] = new LinkedList(new Node(key, value, null));
      this.checkBucketSize();
    }
  }

  get(key) {
    const searchedValue = this.search(key);

    if (searchedValue) {
      return searchedValue.value;
    } else {
      return searchedValue;
    }
  }

  has(key) {
    const searchedValue = this.search(key);

    if (searchedValue) {
      return true;
    } else {
      return false;
    }
  }

  remove(key) {
    // const hashCode = hash the key
    // if (hashCode place is empty)
    //   return false
    // else if (linkedList exist at hashCode)
    //   then we are going to apply linkedList
    //   method to remove that node &
    //   return true

    const index = this.hash(key);

    if (this.bucket[index] === null) {
      return false;
    } else if (this.bucket[index].containsKey(key)) {
      this.bucket[index].removeNode(key);
      return true;
    } else {
      return false;
    }
  }

  lengthOfMap() {
    // const total = 0;
    // for each linkedList in Array
    //   total = total + size of linkedList
    // return total

    let totalKeys = 0;

    for (let i = 0; i < this.bucket.length; i++) {
      let bucketItem = this.bucket[i];
      if (bucketItem) {
        totalKeys += bucketItem.size();
      }
    }

    return totalKeys;
  }

  clear() {
    // for each linkedList in Array
    //   don't just assign the linkHead as null
    //   but delete the linkedList itself
    //   so iterate through the Array
    //     then array[i] = undefined or null
    //javascript garbage collector will free up this memory
    //as there will be no reference to that data now

    //But wouldn't that also be true if i did
    // this.bucket = new Array(this.size).fill(null);
    //What's the difference?

    this.size = 16;
    this.bucket = new Array(this.size).fill(null);
  }

  keys() {
    // const keyArray = [];
    // for each linkedList in Array
    //   iterate over the linkedList
    //     push key in keyArray
    // return keyArray

    let keyArray = [];

    for (let i = 0; i < this.bucket.length; i++) {
      const bucketItem = this.bucket[i];

      if (bucketItem) {
        keyArray.push(...bucketItem.getInfo("key"));
      }
    }

    return keyArray;
  }

  values() {
    // const valuesArray = [];
    // for each linkedList in Array
    //   iterate over the linkedList
    //     push values in valuesArray
    // return valuesArray

    let valueArray = [];

    for (let i = 0; i < this.bucket.length; i++) {
      const bucketItem = this.bucket[i];

      if (bucketItem) {
        valueArray.push(...bucketItem.getInfo("value"));
      }
    }

    return valueArray;
  }

  entries() {
    // const keyValuesArray = [];
    // for each linkedList in Array
    //   iterate over the linkedList
    //     push [key,values] in keyValuesArray
    // return keyValuesArray let valueArray = [];

    let entriesArray = [];

    for (let i = 0; i < this.bucket.length; i++) {
      const bucketItem = this.bucket[i];

      if (bucketItem) {
        entriesArray.push(...bucketItem.getInfo("entries"));
      }
    }

    return entriesArray;
  }

  //a method which search if the key exist in bucket or not.
  //if it does then return the node
  //it it doesn't then return 'null'
  search(key) {
    // if (hashCode place is empty)
    //   return null
    // else if (linkedList exists)
    //   iterate through the linked
    //     if key is found
    //       return node of the key
    //     else
    //       return null

    const index = this.hash(key);

    if (this.bucket[index] === null) {
      return null;
    } else if (this.bucket[index].containsKey(key)) {
      return this.bucket[index].getNode(key);
    } else {
      return null;
    }
  }
}
