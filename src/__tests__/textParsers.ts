import { textsBetween } from '../utils/textParsers';
import { TextsBetweenNoStartEnd } from '../errors';

describe('text parsers', () => {
  describe('text between', () => {
    test('single char start single char end', () => {
      const actual = textsBetween('[', ']')('hello [my] [world]');
      expect(actual).toEqual(['my', 'world']);
    });

    test('extra start symbol', () => {
      const actual = textsBetween('[', ']')('hello [m[y] [world]');
      expect(actual).toEqual(['y', 'world']);
    });

    test('extra end symbol', () => {
      const actual = textsBetween('[', ']')('hello [my] [wor]ld]');
      expect(actual).toEqual(['my', 'wor']);
    });

    test('two char start one char end', () => {
      const actual = textsBetween('${', '}')('hello ${my} ${world}');
      expect(actual).toEqual(['my', 'world']);
    });

    test('two char start two char end', () => {
      const actual = textsBetween('{{', '}}')('hello {{my}} {{world}}');
      expect(actual).toEqual(['my', 'world']);
    });

    test('no end', () => {
      expect(() => textsBetween('{{', '')('hello {{my}} {{world}}'))
        .toThrow(new TextsBetweenNoStartEnd());
    });

    test('escaped', () => {
      expect(textsBetween('${', '}')('hello \\${my} ${world\\}')).toEqual([]);
    });

    test('escaped with single quote', () => {
      expect(textsBetween('${', '}', '\'')('${var} hello \'${my} ${world\'}'))
        .toEqual(['var']);
    });

    test('starting with variable', () => {
      expect(textsBetween('${', '}')('${hello} world')).toEqual(['hello']);
    });
  });
});