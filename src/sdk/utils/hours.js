import moment from 'moment';
import * as yup from 'yup';

import { TIME_PATTERN, DATE_PATTERN, WORK_STATUSES, WEEK_DAYS } from 'constants/hours';

export const labelValidation = yup
  .string()
  .trim()
  .min(3, 'Your input length should be between 3 and 64 symbols.')
  .max(64, 'Your input is too long. Maximum length of label is 64 symbols')
  .required('required');

export function validateHoursField(data, isSplit) {
  const errors = [{}, {}];
  const { time } = data;

  if (!moment(time[0].to).isAfter(time[0].from)) {
    errors[0].to = 'Close time should be later than opening time.';
    return errors;
  }

  if (isSplit) {
    switch (true) {
      case (time[1].from && !moment(time[1].from).isAfter(time[0].to)):
        errors[1].from = 'Open time should be later than close time of 1st interval.';
        break;
      case (time[1].to && time[1].from && !moment(time[1].to).isAfter(time[1].from)):
        errors[1].to = 'Close time should be later than opening time.';
        break;
      case (time[1].from && !time[1].to):
        errors[1].to = 'Required';
        break;
      case (time[1].to && !time[1].from):
        errors[1].from = 'Required';
        break;
      default:
        break;
    }
  }

  return errors;
}

export const timeToMoment = timeArr => timeArr.map(time => ({
  from: moment(time.from, TIME_PATTERN),
  to: moment(time.to, TIME_PATTERN),
}));

export const workTimeToString = day => {
  if (!day.open) return 'Closed';
  if (day.allDay) return 'Open 24h';

  let result = `${moment(day.time[0].from).format(TIME_PATTERN)} - ${moment(day.time[0].to).format(TIME_PATTERN)}`;
  if (day.time[1].from) {
    result += `, ${moment(day.time[1].from).format(TIME_PATTERN)} - ${moment(day.time[1].to).format(TIME_PATTERN)}`;
  }
  return result;
};

const parseTime = time => ({
  time: time.length > 1 ?
    timeToMoment(time)
    : [...timeToMoment(time), { from: null, to: null }],
  open: time[0].work_status !== WORK_STATUSES.CLOSED,
  allDay: time[0].work_status === WORK_STATUSES.ALL_DAY,
  errors: [{}, {}],
});

export const parseHours = data => {
  const { weekly, custom } = data;
  const parsedData = {};

  parsedData.custom = custom.map(customHours => ({
    isSplit: customHours.pickup_time.length > 1 || customHours.delivery_time.length > 1,
    id: customHours.id,
    date: moment(customHours.custom_date, DATE_PATTERN),
    name: customHours.name,
    delivery: parseTime(customHours.delivery_time),
    pickup: parseTime(customHours.pickup_time),
  }));

  parsedData.weeklyTimeSplit = {
    delivery: false,
    pickup: false,
  };
  parsedData.weekly = weekly.map((dayOfWeek, index) => {
    if (dayOfWeek.pickup_time.length > 1) parsedData.weeklyTimeSplit.pickup = true;
    if (dayOfWeek.delivery_time.length > 1) parsedData.weeklyTimeSplit.delivery = true;
    return {
      day: WEEK_DAYS[index],
      delivery: parseTime(dayOfWeek.delivery_time),
      pickup: parseTime(dayOfWeek.pickup_time),
    };
  });

  return parsedData;
};

const prepareTime = (hours, isSplit) => {
  const openStatus = hours.open ? WORK_STATUSES.OPEN : WORK_STATUSES.CLOSED;
  const result = [{
    work_status: hours.open && hours.allDay ? WORK_STATUSES.ALL_DAY : openStatus,
    from: moment(hours.time[0].from).format(TIME_PATTERN),
    to: moment(hours.time[0].to).format(TIME_PATTERN),
  }];

  if (hours.open && isSplit && hours.time[1].from) {
    result.push({
      from: moment(hours.time[1].from).format(TIME_PATTERN),
      to: moment(hours.time[1].to).format(TIME_PATTERN),
    });
  }

  return result;
};

export const prepareHours = (weekly, custom, weeklySplit) => {
  const result = {};
  result.weekly = weekly.map((weekDay, index) => ({
    working_day: index,
    delivery_time: prepareTime(weekDay.delivery, weeklySplit.delivery),
    pickup_time: prepareTime(weekDay.pickup, weeklySplit.pickup),
  }));

  result.custom = custom.map(day => ({
    name: day.name,
    custom_date: moment(day.date).format(DATE_PATTERN),
    delivery_time: prepareTime(day.delivery, day.isSplit),
    pickup_time: prepareTime(day.pickup, day.isSplit),
  }));

  return result;
};

export const fieldHaveErrors = (hours, isSplit) => {
  if (hours.open || !hours.allDay) {
    const { errors } = hours;
    return Object.keys(errors[0]).length > 0 || (isSplit && Object.keys(errors[1]).length > 0);
  }
  return false;
};

export const defaultHours = {
  delivery: {
    open: true,
    allDay: false,
    time: [
      { from: moment('10:00am', TIME_PATTERN), to: moment('08:00pm', TIME_PATTERN) },
      { from: null, to: null },
    ],
    errors: [{}, {}],
  },
  pickup: {
    open: true,
    allDay: false,
    time: [
      { from: moment('10:00am', TIME_PATTERN), to: moment('08:00pm', TIME_PATTERN) },
      { from: null, to: null },
    ],
    errors: [{}, {}],
  },
};

export const fillInWeeklyHours = () => WEEK_DAYS.map(day => ({
  day,
  ...defaultHours,
}));

