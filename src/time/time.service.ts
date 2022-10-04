import * as dayjs from 'dayjs';
import * as updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);

dayjs.updateLocale(dayjs.locale(), {
  weekStart: 1,
  weekdaysMin: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
});

export class TimeService {
  getDate = dayjs;
}

type DayjsType = typeof dayjs;
export type TimeServiceDate = ReturnType<DayjsType>;
export type TimeServiceRawDate = Exclude<Parameters<DayjsType>[0], undefined>;

export default TimeService;
