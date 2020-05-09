import { getOrCall, getOrSetDefault, includesI, keys, nonNull, toNumOrStr, values } from '../utils';
import { BaseError, NullObjectError } from '../../errors';
import * as _ from '../../index';

_;

describe('Utility', () => {
  test('nonNull', () => {
    expect(() => nonNull(null)).toThrow(new NullObjectError());
    expect(() => nonNull(undefined)).toThrow(new NullObjectError());
    expect(nonNull(0)).toEqual(0);
    expect(nonNull('')).toEqual('');
    expect(() => nonNull(undefined, () => new BaseError('', '')))
      .toThrow(new BaseError('', ''));
  });

  test('toNumOrStr', () => {
    expect(toNumOrStr('123')).toEqual(123);
    expect(toNumOrStr('hello')).toEqual('hello');
    expect(toNumOrStr(true)).toEqual('true');
  });

  test('keys', () => {
    expect(keys({ 1: 1, 2: 2 })).toStrictEqual(['1', '2']);

    const map = new Map();
    map.set(1, 1);
    map.set('a', 'b');
    map.set(true, false);
    expect(keys(map)).toStrictEqual([1, 'a', true]);

    class Func {
      readonly a: string = 'b';
    }
    expect(keys(new Func())).toStrictEqual(['a']);
  });

  test('values', () => {
    expect(values({ 1: 1, 2: 2 })).toStrictEqual([1, 2]);

    const map = new Map();
    map.set(1, 1);
    map.set('a', 'b');
    map.set(true, false);
    expect(values(map)).toStrictEqual([1, 'b', false]);
  });

  test('includesI', () => {
    expect(includesI(['a', 'b'], 'c')).toEqual(false);
    expect(includesI(['a', 'b'], 'b')).toEqual(true);
    expect(includesI(['a', undefined], undefined)).toEqual(true);
    expect(includesI(['a', undefined, null], null)).toEqual(true);
    expect(includesI(['a', undefined], null)).toEqual(true);
  });

  test('getOrSetDefault', () => {
    const map = new Map()
    const key1Val = getOrSetDefault(map, 'key1', []);
    expect(key1Val).toStrictEqual([]);

    key1Val.push('val1');
    expect(getOrSetDefault(map, 'key1', [])).toStrictEqual(['val1']);
  });

  test('getOrCall', () => {
    expect(() => getOrCall(new Map(), '', () => { throw new NullObjectError() }))
      .toThrow(new NullObjectError());
  });
});
