import { DateUtilities } from './date';

describe('date utities', () => {
  describe('when calling toIsoDate', () => {
    it('should return the date in ISO format with `MMM yyyy` format', () => {
      const date = 'Mar 2026';
      const expected = '2026-03-01';

      const result = DateUtilities.toIsoDate(date, 'MMM yyyy');
      expect(result).toBe(expected);
    });

    it('should return the date in ISO format with `yyyy` format', () => {
      const date = '2026';
      const expected = '2026-01-01';

      const result = DateUtilities.toIsoDate(date, 'yyyy');
      expect(result).toBe(expected);
    });

    it('should return undefined when the date is not provided', () => {
      const date = undefined;

      const result = DateUtilities.toIsoDate(date, 'MMM yyyy');
      expect(result).toBeUndefined();
    });

    it('should return undefined when the date is not valid', () => {
      const date = 'invalid date';

      const result = DateUtilities.toIsoDate(date, 'MMM yyyy');
      expect(result).toBeUndefined();
    });
  });
});
