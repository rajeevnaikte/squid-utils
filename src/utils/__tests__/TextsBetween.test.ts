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

    test('empty text between', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.get('[] w [hello] w');
      expect(actual).toEqual(['', 'hello']);
    });

    test('1 char between', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.get('[x] w [hello] w');
      expect(actual).toEqual(['x', 'hello']);
    });

    test('2 char between', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.get('[xx] w [hello] w');
      expect(actual).toEqual(['xx', 'hello']);
    });

    test('multi-line', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.get('\n[hello] \n wo[\n]d');
      expect(actual).toEqual(['hello', '\n']);
    });
  });

  describe('split', () => {
    test('split', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('[var] hello [my][world]');
      expect(actual).toEqual([
        { text: '[var]', textBetween: 'var' },
        ' hello ',
        { text: '[my]', textBetween: 'my' },
        { text: '[world]', textBetween: 'world' }
      ]);
    });

    test('escaped', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('[var] hello [my\\][world]');
      expect(actual).toEqual([
        { text: '[var]', textBetween: 'var' },
        ' hello [my]',
        { text: '[world]', textBetween: 'world' }
      ]);
    });

    test('empty text between', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('[] w [hello] w');
      expect(actual).toEqual([
        { text: '[]', textBetween: '' },
        ' w ',
        { text: '[hello]', textBetween: 'hello' },
        ' w'
      ]);
    });

    test('1 char between', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('[x] w [hello] w');
      expect(actual).toEqual([
        { text: '[x]', textBetween: 'x' },
        ' w ',
        { text: '[hello]', textBetween: 'hello' },
        ' w'
      ]);
    });

    test('2 char between', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('[xx] w [hello] w');
      expect(actual).toEqual([
        { text: '[xx]', textBetween: 'xx' },
        ' w ',
        { text: '[hello]', textBetween: 'hello' },
        ' w'
      ]);
    });

    test('multi-line', () => {
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.split('\n[hello] \n wo[\n]d');
      expect(actual).toEqual([
        '\n',
        { text: '[hello]', textBetween: 'hello' },
        ' \n wo',
        { text: '[\n]', textBetween: '\n' },
        'd'
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

    test('empty text between', () => {
      const data: JsonType = {
        var: 1,
        hello: 'earth',
        '': 'empty'
      };
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.replace('[] w [hello] w', textBetween => data[textBetween] as string);
      expect(actual).toEqual('empty w earth w');
    });

    test('1 char between', () => {
      const data: JsonType = {
        var: 1,
        hello: 'earth',
        'x': 'empty'
      };
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.replace('[x] w [hello] w', textBetween => data[textBetween] as string);
      expect(actual).toEqual('empty w earth w');
    });

    test('2 char between', () => {
      const data: JsonType = {
        var: 1,
        hello: 'earth',
        'xx': 'empty'
      };
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.replace('[xx] w [hello] w', textBetween => data[textBetween] as string);
      expect(actual).toEqual('empty w earth w');
    });

    test('multi-line', () => {
      const data: JsonType = {
        hello: 'earth',
        '\n': ' newline '
      };
      const textsBetween = new TextsBetween('[', ']');
      const actual = textsBetween.replace('\n[hello] \n wo[\n]d', textBetween => data[textBetween] as string);
      expect(actual).toEqual('\nearth \n wo newline d');
    });
  });
});