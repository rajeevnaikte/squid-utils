import { JsonType, TextsBetweenNoStartEnd } from '../../index';
import { TextsBetween } from '../TextsBetween';

describe('text between', () => {
  describe('get', () => {
    test('single char start single char end', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.get('hello [my] [world]');
      expect(actual).toEqual(['my', 'world']);
    });

    test('extra start symbol', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.get('hello [m[y] [world]');
      expect(actual).toEqual(['y', 'world']);
    });

    test('extra end symbol', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.get('hello [my] [wor]ld]');
      expect(actual).toEqual(['my', 'wor']);
    });

    test('two char start one char end', () => {
      const textsBetween = new TextsBetween('${', '}');
      const actual = textsBetween.get('hello ${my} ${world}');
      expect(actual).toEqual(['my', 'world']);
    });

    test('two char start two char end', () => {
      const textsBetween = new TextsBetween('{{', '}}');
      const actual = textsBetween.get('hello {{my}} {{world}}');
      expect(actual).toEqual(['my', 'world']);
    });

    test('no end', () => {
      expect(() => new TextsBetween('[', '')).toThrow(new TextsBetweenNoStartEnd());
    });

    test('escaped', () => {
      const textsBetween = new TextsBetween('${', '}');
      const actual = textsBetween.get('hello \\${my} ${world\\}');
      expect(actual).toEqual([]);
    });

    test('escaped with single quote', () => {
      const textsBetween = new TextsBetween('${', '}', '\'');
      const actual = textsBetween.get('hello \'${my} ${world\'}');
      expect(actual).toEqual([]);
    });

    test('starting with variable', () => {
      const textsBetween = new TextsBetween('${', '}');
      const actual = textsBetween.get('${hello} world');
      expect(actual).toEqual(['hello']);
    });
  });

  describe('split', () => {
    test('split', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('[var] hello [my][world]');
      expect(actual).toEqual([
        { textBetween: 'var' },
        ' hello ',
        { textBetween: 'my' },
        { textBetween: 'world' }
      ]);
    });

    test('escaped', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('[var] hello [my\\][world]');
      expect(actual).toEqual([
        { textBetween: 'var' },
        ' hello [my]',
        { textBetween: 'world' }
      ]);
    });
  });

  describe('replace', () => {
    test('replace', () => {
      const data: JsonType = {
        var: 1,
        world: 'earth'
      };
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.replace('[var] hello \\ [my][world]', textBetween => data[textBetween] as string);
      expect(actual).toEqual('1 hello \\ earth');
    });

    test('escaped', () => {
      const data: JsonType = {
        var: 1,
        world: 'earth'
      };
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.replace('[var] hello [my\\][world]', textBetween => data[textBetween] as string);
      expect(actual).toEqual('1 hello [my]earth');
    });
  });
});