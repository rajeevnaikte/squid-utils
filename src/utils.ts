import { NullObjectError } from './errors';

/**
 * Return same object if not null. Otherwise throw error.
 * @param object
 */
const getNonNull = <T>(object: T): T => {
  if (object !== undefined && object !== null) {
    return object;
  }
  throw new NullObjectError();
};

/**
 * If string form of number parse to number or get toString value.
 * @param object
 */
const toNumOrString = <T>(object: T): string | number => {
  if (isNaN(object as any) || typeof object === 'boolean') {
    return (object as any).toString();
  } else {
    return parseFloat(object as any);
  }
};

/**
 * Get all keys of an object or a Map in an array.
 * @param object
 */
const getKeysArray = (object: { [key: string]: any } | Map<any, any>): any[] => {
  if (object instanceof Map) {
    return Array.from(object.keys());
  } else {
    return Object.keys(object);
  }
};

/**
 * Get all values of an object or a Map in an array.
 * @param object
 */
const getValuesArray = (object: { [key: string]: any } | Map<any, any>): any[] => {
  if (object instanceof Map) {
    return Array.from(object.values());
  } else {
    return Object.keys(object).map(key => object[key]);
  }
};

/**
 * Check if the searchString present in given array of strings, ignoring case.
 * @param collection
 * @param searchString
 */
const includesI = (collection: (string | null | undefined)[], searchString: string | null | undefined): boolean => {
  return collection.map(item => item?.toLowerCase()).includes(searchString?.toLowerCase());
};

/**
 * Get map value for the key. If not exists then set into the map with defaultValue and return the defaultValue.
 * @param map
 * @param key
 * @param defaultValue
 */
const getOrSetDefault = <T, K>(map: Map<T, K>, key: T, defaultValue: K): K => {
  const value = map.get(key);
  if (value) return value;
  map.set(key, defaultValue);
  return defaultValue;
};

export {
  getNonNull,
  toNumOrString,
  getKeysArray,
  getValuesArray,
  includesI,
  getOrSetDefault
}
