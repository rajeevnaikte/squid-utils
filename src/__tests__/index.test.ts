import { getKeysArray, getNonNull, getValuesArray, includesI, toNumOrString } from '../index';
import { NullObjectError } from '../errors';

describe('Utility', () => {
  test('getNotNull', () => {
    expect(() => getNonNull(null)).toThrow(new NullObjectError());
    expect(() => getNonNull(undefined)).toThrow(new NullObjectError());
    expect(getNonNull(0)).toEqual(0);
    expect(getNonNull('')).toEqual('');
  });

  test('toNumOrString', () => {
    expect(toNumOrString('123')).toEqual(123);
    expect(toNumOrString('hello')).toEqual('hello');
    expect(toNumOrString(true)).toEqual('true');
  });

  test('getKeysArray', () => {
    expect(getKeysArray({ 1: 1, 2: 2 })).toStrictEqual(['1', '2']);

    const map = new Map();
    map.set(1, 1);
    map.set('a', 'b');
    map.set(true, false);
    expect(getKeysArray(map)).toStrictEqual([1, 'a', true]);
  });

  test('getValuesArray', () => {
    expect(getValuesArray({ 1: 1, 2: 2 })).toStrictEqual([1, 2]);

    const map = new Map();
    map.set(1, 1);
    map.set('a', 'b');
    map.set(true, false);
    expect(getValuesArray(map)).toStrictEqual([1, 'b', false]);
  });

  test('hasIgnoreCase', () => {
    expect(includesI(['a', 'b'], 'c')).toEqual(false);
    expect(includesI(['a', 'b'], 'b')).toEqual(true);
    expect(includesI(['a', undefined], undefined)).toEqual(true);
    expect(includesI(['a', undefined, null], null)).toEqual(true);
    expect(includesI(['a', undefined], null)).toEqual(true);
  });
});
