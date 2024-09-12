import { format, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';

export class DateUtilities {
  public static toIsoDate(date: string | undefined, dateFormat: 'MMM yyyy' | 'yyyy'): string | undefined {
    if (!date) return undefined;

    try {
      const parsedDate = parse(date, dateFormat, new Date(), { locale: enUS });
      return format(parsedDate, 'yyyy-MM-dd');
    } catch {
      return undefined;
    }
  }
}
