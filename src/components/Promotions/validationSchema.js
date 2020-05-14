import * as Yup from 'yup';
import { offers } from 'constants/promotions';
import moment from 'moment';

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Your input length should be between 3 and 64 symbols.')
    .max(64, 'Your input length should be between 3 and 64 symbols.')
    .required(),
  description: Yup.string()
    .min(3, 'Your input length should be between 3 and 255 symbols.')
    .max(255, 'Your input length should be between 3 and 255 symbols.'),
  code: Yup.string()
    .trim()
    .matches(/^[A-Z0-9_]*$/, 'Promotion code allows only upper case letters, numbers and underscores')
    .min(3, 'Your input length should be between 3 and 20 symbols.')
    .max(20, 'Your input length should be between 3 and 20 symbols.')
    .required('Promotion code is a required field.'),
  price_discount: Yup.number().when('offer', (offer, schema) => {
    if (offer !== offers.DOLLAR) {
      return schema.notRequired();
    }

    return schema.typeError('should be a number')
      .min(0, 'should be beetween 0 and 100')
      .max(100, 'should be beetween 0 and 100')
      .required('is required.');
  }),
  percentage_discount: Yup.number().when('offer', (offer, schema) => {
    if (offer !== offers.PERCENT) {
      return schema.notRequired();
    }

    return schema.typeError('should be a number')
      .integer('should be an integer')
      .min(1, 'should be beetween 1 and 100')
      .max(100, 'should be beetween 1 and 100')
      .required('is required.');
  }),
  free_menu_item: Yup.object().when('offer', (offer, schema) => {
    if (offer !== offers.ITEM) {
      return schema.notRequired();
    }

    return schema.nullable().required('is required.');
  }),
  max_discount: Yup.number().when('offer', (offer, schema) => {
    if (offer !== offers.ITEM) {
      return schema.notRequired();
    }

    return schema.typeError('should be a number')
      .min(1, 'should be beetween 1 and 100')
      .max(100, 'should be beetween 1 and 100');
  }),
  min_order_amount: Yup.number().typeError('should be a number')
    .min(1, 'should be beetween 1 and 500')
    .max(500, 'should be beetween 1 and 500')
    .required('is required.'),
});

export const additionalValidation = data => {
  const errors = {};
  if (
    data.offer === offers.DOLLAR
    && +data.price_discount > +data.min_order_amount
  ) {
    errors.min_order_amount = 'Order amount constraint should be bigger than dollar off value';
  }
  if (
    data.status === 'active'
    && !data.week_days.length
  ) errors.week_days = 'There should be at least one active day';
  if (
    data.offer === offers.ITEM
    && +data.max_discount > +data.min_order_amount
  ) {
    errors.min_order_amount = 'Order amount constraint should be bigger than maximum discount value';
  }
  if (!data.ongoing) {
    if (data.end_date) {
      if (moment(data.start_date).isAfter(data.end_date)) errors.end_date = 'Your end date should be later than the start date.';
      if (moment().subtract(1, 'days').isAfter(data.end_date)) errors.end_date = 'Your end date should be set in the future.';
    } else {
      errors.end_date = 'Required';
    }
    if (!data.end_time) errors.end_time = 'Required';
  }
  return errors;
};
