import { DateUtilities } from './date';

describe('date utilities', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-10-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('when calling toIsoDate', () => {
    it('should correctly format a date in `MMM yyyy` format to ISO format', () => {
      const date = 'Mar 2026';
      const expected = '2026-03-01';

      const result = DateUtilities.toIsoDate(date);
      expect(result).toBe(expected);
    });

    it('should correctly format a date in `yyyy` format to ISO format', () => {
      const date = '2026';
      const expected = '2026-01-01';

      const result = DateUtilities.toIsoDate(date);
      expect(result).toBe(expected);
    });

    it("should return today's date in ISO format when the date is not provided", () => {
      const date = undefined;
      const expected = '2023-10-01';

      const result = DateUtilities.toIsoDate(date);
      expect(result).toBe(expected);
    });

    it("should return today's date in ISO format when the date is invalid", () => {
      const date = 'invalid date';
      const expected = '2023-10-01';

      const result = DateUtilities.toIsoDate(date);
      expect(result).toBe(expected);
    });
  });
});
