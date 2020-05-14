import moment from 'moment';

import { offers, defaultWeekDays, DATE_PATTERN, TIME_PATTERN } from 'constants/promotions';


export const parsePromo = promo => {
  const parsed = {
    name: promo.name,
    description: promo.description ? promo.description : '',
    code: promo.code || '',
    id: promo.id,
    price_discount: '',
    percentage_discount: '',
    free_menu_item: '',
    multiple_usage: promo.multiple_usage ? 'multiple' : 'once',
    // TODO: remove checking(temporary solution because of requirements changes)
    min_order_amount: promo.min_order_amount
      || promo.one_order_min_amount
      || promo.multi_order_min_amount,
    ongoing: !promo.end_date,
    start_date: moment(promo.start_date, DATE_PATTERN),
    end_date: promo.end_date ? moment(promo.end_date, DATE_PATTERN) : moment(),
    start_time: moment(promo.start_time, TIME_PATTERN),
    end_time: promo.end_time ? moment(promo.end_time, TIME_PATTERN) : moment(),
    week_days: promo.week_days ?
      Object.keys(promo.week_days).filter(day => promo.week_days[day]) :
      defaultWeekDays,
    status: promo.status ? 'active' : 'inactive',
  };
  switch (true) {
    case !!promo.price_discount:
      parsed.offer = offers.DOLLAR;
      parsed.price_discount = promo.price_discount;
      break;
    case !!promo.percentage_discount:
      parsed.offer = offers.PERCENT;
      parsed.percentage_discount = promo.percentage_discount;
      break;
    case !!promo.free_menu_item:
      parsed.offer = offers.ITEM;
      parsed.free_menu_item = promo.free_menu_item;
      parsed.max_discount = promo.max_discount || '';
      break;
    default:
      break;
  }
  return parsed;
};

export const preparePromo = promo => {
  const prepared = {
    name: promo.name,
    description: promo.description,
    code: promo.code.trim(),
    start_date: promo.start_date.format(DATE_PATTERN),
    start_time: promo.start_time.format(TIME_PATTERN),
    multiple_usage: promo.multiple_usage === 'multiple',
    week_days: defaultWeekDays.reduce((acc, day) => {
      acc[day] = promo.week_days.includes(day);
      return acc;
    }, {}),
    status: promo.status === 'active',
  };
  prepared.min_order_amount = promo.min_order_amount;
  if (promo.offer === offers.DOLLAR) {
    prepared.price_discount = promo.price_discount;
  } else if (promo.offer === offers.PERCENT) {
    prepared.percentage_discount = promo.percentage_discount;
  } else {
    prepared.free_menu_item = promo.free_menu_item.id;
    if (promo.max_discount) prepared.max_discount = promo.max_discount;
  }
  if (!promo.ongoing) {
    prepared.end_date = promo.end_date.format(DATE_PATTERN);
    prepared.end_time = promo.end_time.format(TIME_PATTERN);
  }
  return prepared;
};
