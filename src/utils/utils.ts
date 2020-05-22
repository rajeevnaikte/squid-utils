import { BaseError, NullObjectError } from '../errors';
import { JsonObjectType } from '../types';

/**
 * Return same object if not null. Otherwise throw error.
 * @param object
 * @param errorObjectSupplier
 */
export const nonNull = <T, R extends BaseError> (
  object: T, errorObjectSupplier?: () => R): NonNullable<T> => {
  if (object !== undefined && object !== null) {
    return object as NonNullable<T>;
  }
  if (errorObjectSupplier) {
    throw errorObjectSupplier();
  }
  throw new NullObjectError();
};

/**
 * If string form of number parse to number or get toString value.
 * @param object
 */
export const toNumOrStr = <T> (object: T): string | number => {
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
export const keys = (object: { [key: string]: any } | Map<any, any>): any[] => {
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
export const values = (object: { [key: string]: any } | Map<any, any>): any[] => {
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
export const includesI = (collection: (string | null | undefined)[], searchString: string | null | undefined): boolean => {
  return collection.map(item => item?.toLowerCase()).includes(searchString?.toLowerCase());
};

/**
 * Get map value for the key. If not pathExists then set into the map with defaultValue and return the defaultValue.
 * @param map
 * @param key
 * @param defaultValue
 */
export const getOrSetDefault = <T, K> (map: Map<T, K>, key: T, defaultValue: K): K => {
  const value = map.get(key);
  if (value) return value;
  map.set(key, defaultValue);
  return defaultValue;
};

/**
 * Get map value for the key. If not pathExists then call the function. and return its value if any.
 * @param map
 * @param key
 * @param onNotExist
 */
export const getOrCall = <T, K, R> (map: Map<T, K>, key: T, onNotExist: () => R): K | R => {
  const value = map.get(key);
  if (value) return value;
  return onNotExist();
};

/**
 * Returns the proxy of given object with getter and setter.
 * @param object
 * @param onSet
 * @param onGet
 */
export const proxyObject = (
  object: { [key: string]: any },
  onSet?: (key: PropertyKey, prevVal: any, newVal: any) => any,
  onGet?: (key: PropertyKey, val: any) => any
): JsonObjectType => {
  return new Proxy(object, {
    get: (target, key, receiver) => {
      let val = Reflect.get(target, key, receiver);
      if (onGet) val = onGet(key, val) ?? val;
      return val;
    },
    set: (target, key, value, receiver): boolean => {
      const currValue = target[key as string];
      if (onSet) value = onSet(key as string, currValue, value) ?? value;
      Reflect.set(target, key, value, receiver);
      return true;
    }
  });
};
