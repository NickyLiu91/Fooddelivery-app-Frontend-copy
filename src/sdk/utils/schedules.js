import moment from 'moment';
import { TIME_PATTERN, WEEK_DAYS } from 'constants/schedules';

export function validateHoursField(data) {
  const errors = { error: '' };

  if (!moment(data.to).isAfter(data.from)) {
    errors.error = 'Close time should be later than opening time.';
    return errors;
  }

  return errors;
}

export const prepareHours = (weekly) => weekly.map((weekDay) => ({
  week_day: WEEK_DAYS.indexOf(weekDay.week_day),
  from: moment(weekDay.from)
    .format(TIME_PATTERN),
  to: moment(weekDay.to)
    .format(TIME_PATTERN),
}));

export const parseData = (weekly) => {
  const newData = weekly.menu_schedule_items.map((weekDay) => ({
    week_day: WEEK_DAYS[weekDay.week_day],
    from: moment(weekDay.from, TIME_PATTERN),
    to: moment(weekDay.to, TIME_PATTERN),
    errors: { error: '' },
    open: true,
  }));

  if (weekly.menu_schedule_items.length === 7) {
    return newData;
  }
  const closeDays = WEEK_DAYS.map(day => ({
    week_day: day,
    open: false,
    from: moment('10:00am', TIME_PATTERN),
    to: moment('08:00pm', TIME_PATTERN),
    errors: { error: '' },
  }));

  /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

  for (let i = 0; i < weekly.menu_schedule_items.length; i++) {
    for (let j = 0; j < closeDays.length; j++) {
      if (closeDays[j].week_day === WEEK_DAYS[weekly.menu_schedule_items[i].week_day]) {
        closeDays[j].from = moment(weekly.menu_schedule_items[i].from, TIME_PATTERN);
        closeDays[j].to = moment(weekly.menu_schedule_items[i].to, TIME_PATTERN);
        closeDays[j].open = true;
        closeDays[j].errors = { error: '' };
      }
    }
  }

  return closeDays;
};

export const defaultHours = {
  open: true,
  from: moment('10:00am', TIME_PATTERN),
  to: moment('08:00pm', TIME_PATTERN),
  errors: { error: '' },
};

export const fillInWeeklyHours = () => WEEK_DAYS.map(day => ({
  week_day: day,
  ...defaultHours,
}));

