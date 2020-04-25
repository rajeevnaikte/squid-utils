import { safeRegex } from '../utils/textParsers';

describe('text parsers', () => {
  describe('safeRegex', () => {
    test('backslash', () => {
      expect(safeRegex('\\')).toEqual('[\\\\]');
    });
  });
});