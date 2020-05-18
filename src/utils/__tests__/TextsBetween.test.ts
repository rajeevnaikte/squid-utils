import { JsonType, NestedTextsBetweenNotAllowed, TextsBetweenInvalidInput, TextsBetweenNoStartEnd } from '../../index';
import { TextsBetween } from '../TextsBetween';

describe('text between', () => {
  describe('get', () => {
    test('empty input', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('').get();
      expect(actual).toEqual([]);
    });

    test('no texts between in input', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('hello world').get();
      expect(actual).toEqual([]);
    });

    test('single char start single char end', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('hello [my] [world]').get();
      expect(actual).toEqual(['my', 'world']);
    });

    test('extra start symbol', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('hello [y] [world]').get();
      expect(actual).toEqual(['y', 'world']);
    });

    test('extra end symbol', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('hello [my] [wor]ld]').get();
      expect(actual).toEqual(['my', 'wor']);
    });

    test('two char start one char end', () => {
      const textsBetween = new TextsBetween.Builder('${', '}').build();
      const actual = textsBetween.parse('hello ${my} ${world}').get();
      expect(actual).toEqual(['my', 'world']);
    });

    test('two char start two char end', () => {
      const textsBetween = new TextsBetween.Builder('{{', '}}').build();
      const actual = textsBetween.parse('hello {{my}} {{world}}').get();
      expect(actual).toEqual(['my', 'world']);
    });

    test('no end', () => {
      expect(() => new TextsBetween.Builder('[', '').build()).toThrow(new TextsBetweenNoStartEnd());
    });

    test('escaped', () => {
      const textsBetween = new TextsBetween.Builder('${', '}').withStaleStartIgnored().build();
      const actual = textsBetween.parse('hello \\${my} ${world\\}').get();
      expect(actual).toEqual([]);
    });

    test('escaped with single quote', () => {
      const textsBetween = new TextsBetween.Builder('${', '}')
        .withEscapeChar('\'').withStaleStartIgnored().build();
      const actual = textsBetween.parse('hello \'${my} ${world\'}').get();
      expect(actual).toEqual([]);
    });

    test('starting with variable', () => {
      const textsBetween = new TextsBetween.Builder('${', '}').build();
      const actual = textsBetween.parse('${hello} world').get();
      expect(actual).toEqual(['hello']);
    });

    test('empty text between', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[] w [hello] w').get();
      expect(actual).toEqual(['', 'hello']);
    });

    test('1 char between', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[x] w [hello] w').get();
      expect(actual).toEqual(['x', 'hello']);
    });

    test('2 char between', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[xx] w [hello] w').get();
      expect(actual).toEqual(['xx', 'hello']);
    });

    test('multi-line', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('\n[hello] \n wo[\n]d').get();
      expect(actual).toEqual(['hello', '\n']);
    });

    test('allow nested', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').withNestedAllowed().build();
      const actual = textsBetween.parse('\n[he[l]lo] \n wo[\n]d').get();
      expect(actual).toEqual(['he[l]lo', '\n']);
    });
  });

  describe('split', () => {
    test('split', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[var] hello [my][world]').split();
      expect(actual).toEqual([
        { text: '[var]', textBetween: 'var' },
        ' hello ',
        { text: '[my]', textBetween: 'my' },
        { text: '[world]', textBetween: 'world' }
      ]);
    });

    test('escaped', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[var] hello \\[my\\][world]').split();
      expect(actual).toEqual([
        { text: '[var]', textBetween: 'var' },
        ' hello [my]',
        { text: '[world]', textBetween: 'world' }
      ]);
    });

    test('empty text between', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[] w [hello] w').split();
      expect(actual).toEqual([
        { text: '[]', textBetween: '' },
        ' w ',
        { text: '[hello]', textBetween: 'hello' },
        ' w'
      ]);
    });

    test('1 char between', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[x] w [hello] w').split();
      expect(actual).toEqual([
        { text: '[x]', textBetween: 'x' },
        ' w ',
        { text: '[hello]', textBetween: 'hello' },
        ' w'
      ]);
    });

    test('2 char between', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[xx] w [hello] w').split();
      expect(actual).toEqual([
        { text: '[xx]', textBetween: 'xx' },
        ' w ',
        { text: '[hello]', textBetween: 'hello' },
        ' w'
      ]);
    });

    test('multi-line', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('\n[hello] \n wo[\n]d').split();
      expect(actual).toEqual([
        '\n',
        { text: '[hello]', textBetween: 'hello' },
        ' \n wo',
        { text: '[\n]', textBetween: '\n' },
        'd'
      ]);
    });

    test('allow nested', () => {
      const textsBetween = new TextsBetween.Builder('[', ']').withNestedAllowed().build();
      const actual = textsBetween.parse('[var] hello [my][wo[rl]d]').split();
      expect(actual).toEqual([
        { text: '[var]', textBetween: 'var' },
        ' hello ',
        { text: '[my]', textBetween: 'my' },
        { text: '[wo[rl]d]', textBetween: 'wo[rl]d' }
      ]);
    });
  });

  describe('replace', () => {
    test('replace', () => {
      const data: JsonType = {
        var: 1,
        world: 'earth'
      };
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[var] hello \\ [my][world]').replace(textBetween => data[textBetween] as string);
      expect(actual).toEqual('1 hello \\ earth');
    });

    test('escaped', () => {
      const data: JsonType = {
        var: 1,
        world: 'earth'
      };
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[var] hello \\[my\\][world]').replace(textBetween => data[textBetween] as string);
      expect(actual).toEqual('1 hello [my]earth');
    });

    test('empty text between', () => {
      const data: JsonType = {
        var: 1,
        hello: 'earth',
        '': 'empty'
      };
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[] w [hello] w').replace(textBetween => data[textBetween] as string);
      expect(actual).toEqual('empty w earth w');
    });

    test('1 char between', () => {
      const data: JsonType = {
        var: 1,
        hello: 'earth',
        'x': 'empty'
      };
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[x] w [hello] w').replace(textBetween => data[textBetween] as string);
      expect(actual).toEqual('empty w earth w');
    });

    test('2 char between', () => {
      const data: JsonType = {
        var: 1,
        hello: 'earth',
        'xx': 'empty'
      };
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('[xx] w [hello] w').replace(textBetween => data[textBetween] as string);
      expect(actual).toEqual('empty w earth w');
    });

    test('multi-line', () => {
      const data: JsonType = {
        hello: 'earth',
        '\n': ' newline '
      };
      const textsBetween = new TextsBetween.Builder('[', ']').build();
      const actual = textsBetween.parse('\n[hello] \n wo[\n]d').replace(textBetween => data[textBetween] as string);
      expect(actual).toEqual('\nearth \n wo newline d');
    });

    test('nested allowed', () => {
      const data: JsonType = {
        var: 1,
        ['wo[rl]d']: 'earth'
      };
      const textsBetween = new TextsBetween.Builder('[', ']').withNestedAllowed().build();
      const actual = textsBetween.parse('[var] hello \\ [my][wo[rl]d]').replace(textBetween => data[textBetween] as string);
      expect(actual).toEqual('1 hello \\ earth');
    });
  });

  describe('getIndices', () => {
    test('basic', () => {
      const tb = new TextsBetween.Builder('[', ']').build();
      expect(
        // @ts-ignore
        tb.getIndices('[hello] ny [world]')
      ).toEqual([0, 6, 11, 17]);
    });

    test('multi-line', () => {
      const tb = new TextsBetween.Builder('[', ']').build();
      expect(
        // @ts-ignore
        tb.getIndices('\n[hello] \nny [\n]')
      ).toEqual([1, 7, 13, 15]);
    });

    test('two start char', () => {
      const tb = new TextsBetween.Builder('$[', ']').build();
      expect(
        // @ts-ignore
        tb.getIndices('\n$[hello] \nny $[\n]')
      ).toEqual([1, 8, 14, 17]);
    });

    test('escaped start', () => {
      const tb = new TextsBetween.Builder('$[', ']').build();
      expect(
        // @ts-ignore
        tb.getIndices('\n\\$[hello] \nny $[\n]')
      ).toEqual([15, 18]);
    });

    test('escaped end', () => {
      const tb = new TextsBetween.Builder('$[', ']').build();
      expect(
        // @ts-ignore
        tb.getIndices('\n$[hello] \nny\\] $[\n]')
      ).toEqual([1, 8, 16, 19]);
    });

    test('stale start', () => {
      const tb = new TextsBetween.Builder('$[', ']').build();
      const text = '\n$[hello] \nny\\] $[\n';
      expect(() =>
        // @ts-ignore
        tb.getIndices(text)
      ).toThrow(new TextsBetweenInvalidInput(text, 16));
    });

    test('stale start escaped', () => {
      const tb = new TextsBetween.Builder('[', ']').build();
      const text = '\n[hello] \nny\\] \\[\n';
      expect(
        // @ts-ignore
        tb.getIndices(text)
      ).toEqual([1, 7]);
    });

    test('empty text between', () => {
      const tb = new TextsBetween.Builder('[', ']').build();
      expect(
        // @ts-ignore
        tb.getIndices('\n[] \nny [\n]')
      ).toEqual([1, 2, 8, 10]);
    });

    test('one char text between', () => {
      const tb = new TextsBetween.Builder('[', ']').build();
      expect(
        // @ts-ignore
        tb.getIndices('\n[x] \nny [\n]')
      ).toEqual([1, 3, 9, 11]);
    });

    test('nested when not allowed', () => {
      const tb = new TextsBetween.Builder('[', ']').build();
      const text = '\n[he[l]lo] \nny\\] [\n]';
      expect(() =>
        // @ts-ignore
        tb.getIndices(text)
      ).toThrow(new TextsBetweenInvalidInput(text, 4));
    });

    test('nested when allowed', () => {
      const tb = new TextsBetween.Builder('[', ']').withNestedAllowed().build();
      expect(
        // @ts-ignore
        tb.getIndices('\n[he[l]lo] \nny\\] [\n]')
      ).toEqual([1, 9, 17, 19]);
    });

    test('same start and end', () => {
      const tb = new TextsBetween.Builder('"', '"').build();
      expect(
        // @ts-ignore
        tb.getIndices('\n"hello" my "world"')
      ).toEqual([1, 7, 12, 18]);
    });

    describe('same start and end', () => {
      test('nested not allowed', () => {
        expect(() => new TextsBetween.Builder('"', '"').withNestedAllowed())
          .toThrow(new NestedTextsBetweenNotAllowed());
      });

      test('basic', () => {
        const tb = new TextsBetween.Builder('"', '"').build();
        expect(
          // @ts-ignore
          tb.getIndices('\n"hello" my "wor\\"ld"')
        ).toEqual([1, 7, 12, 20]);
      });

      test('same escape', () => {
        const tb = new TextsBetween.Builder('"', '"').withEscapeChar('"').build();
        expect(
          // @ts-ignore
          tb.getIndices('\n"hello" my "wor""ld"')
        ).toEqual([1, 7, 12, 20]);
      });

      test('empty text between', () => {
        const tb = new TextsBetween.Builder('"', '"').withEscapeChar('"').build();
        expect(
          // @ts-ignore
          tb.getIndices('\n"" my """ld"')
        ).toEqual([1, 2, 7, 12]);
      });

      test('stale start', () => {
        const tb = new TextsBetween.Builder('"', '"').withEscapeChar('"').build();
        const text = '\n"hello" my "wor""ld" " ';
        expect(() =>
          // @ts-ignore
          tb.getIndices(text)
        ).toThrow(new TextsBetweenInvalidInput(text, 22));
      });

      test('stale start escaped', () => {
        const tb = new TextsBetween.Builder('"', '"').build();
        expect(
          // @ts-ignore
          tb.getIndices('\n"" my "ld" \\" ')
        ).toEqual([1, 2, 7, 10]);
      });

      test('stale start 2', () => {
        const tb = new TextsBetween.Builder('"', '"').withEscapeChar('"').build();
        const text = '\n"hello" my "wor""ld"" ';
        expect(() =>
          // @ts-ignore
          tb.getIndices(text)
        ).toThrow(new TextsBetweenInvalidInput(text, 12));
      });
    });
  });
});