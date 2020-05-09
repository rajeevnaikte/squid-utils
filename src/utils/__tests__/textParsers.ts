import { safeRegex } from '../textParsers';

describe('text parsers', () => {
  describe('safeRegex', () => {
    test('backslash', () => {
      expect(safeRegex('\\')).toEqual('[\\\\]');
    });
  });
});