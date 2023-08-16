export class Enum {
  constructor(...args) {
    const memberArray = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    const memberCount = memberArray.length;
    for (let index = 0; index < memberCount; index++) {
      const element = memberArray[index];
      this[element] = index;
      this[index] = element;
    }
  }
  
  getNumberAccessor(member) {
    if (typeof member === 'string') return this[member] || -1;
    if (typeof member === 'number') return this[member] ? number : -1;
    return -1;
  }
  
  getStringAccessor(member) {
    if (typeof member === 'number') return this[member] || 'NOT_FOUND';
    if (typeof member === 'string') return this[member] ? string : 'NOT_FOUND';
    return 'NOT_FOUND';
  }
}
