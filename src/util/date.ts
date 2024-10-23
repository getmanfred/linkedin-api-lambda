import { format, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { logger } from './logger';

export class DateUtilities {
  public static toIsoDate(date: string | undefined): string {
    const dateFormats = ['MMM yyyy', 'yyyy'];
    const now = format(new Date(), 'yyyy-MM-dd');

    if (!date) {
      logger.warn(`[DateUtilities] Date is not provided, so returning today's date`);
      return now;
    }

    for (const dateFormat of dateFormats) {
      try {
        const parsedDate = parse(date, dateFormat, new Date(), { locale: enUS });
        if (!isNaN(parsedDate.getTime())) return format(parsedDate, 'yyyy-MM-dd');
      } catch {
        continue;
      }
    }

    logger.warn(`[DateUtilities] Could not parse date: ${date}, so returning today's date`);
    return now;
  }
}
