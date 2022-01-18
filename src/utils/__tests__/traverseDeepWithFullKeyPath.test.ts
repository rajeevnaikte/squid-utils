import { traverseJsonDeep, traverseJsonDeepAsync } from '../..';

describe('traverseDeepWithFullKeyPath', () =>
{
  test('map data with arrays', () =>
  {
    const keyPaths: string[] = [];
    traverseJsonDeep({
      test: {
        success: true,
      },
      array: [
        'string',
        {
          item: 1,
        },
      ],
      string: null,
    }, (key, value, fullKeyPath) => keyPaths.push(fullKeyPath));

    expect(keyPaths).toEqual([
      'test',
      'test.success',
      'array',
      'array[0]',
      'array[1]',
      'array[1].item',
      'string',
    ]);
  });

  test('array data with nested maps', () =>
  {
    const keyPaths: string[] = [];
    traverseJsonDeep([
      'string',
      {
        item: 1,
      },
    ], (key, value, fullKeyPath) => keyPaths.push(fullKeyPath));

    expect(keyPaths).toEqual([
      '[0]',
      '[1]',
      '[1].item',
    ]);
  });

  test('string input', () =>
  {
    const keyPaths: string[] = [];
    traverseJsonDeep('string', (key, value, fullKeyPath) => keyPaths.push(fullKeyPath));

    expect(keyPaths).toEqual([]);
  });

  describe('async version', () =>
  {
    test('map data with arrays', async () =>
    {
      const keyPaths: string[] = [];
      await traverseJsonDeepAsync({
          test: {
            success: true,
          },
          array: [
            'string',
            {
              item: 1,
            },
          ],
          string: null,
        }, async (key, value, fullKeyPath) => { keyPaths.push(fullKeyPath); }
      );

      expect(keyPaths).toEqual([
        'test',
        'test.success',
        'array',
        'array[0]',
        'array[1]',
        'array[1].item',
        'string',
      ]);
    });

    test('array data with nested maps', async () =>
    {
      const keyPaths: string[] = [];
      await traverseJsonDeepAsync([
          'string',
          {
            item: 1,
          },
        ], async (key, value, fullKeyPath) => { keyPaths.push(fullKeyPath) }
      );

      expect(keyPaths).toEqual([
        '[0]',
        '[1]',
        '[1].item',
      ]);
    });

    test('string input', async () =>
    {
      const keyPaths: string[] = [];
      await traverseJsonDeepAsync('string', async (key, value, fullKeyPath) => { keyPaths.push(fullKeyPath) });

      expect(keyPaths).toEqual([]);
    });
  });
});
