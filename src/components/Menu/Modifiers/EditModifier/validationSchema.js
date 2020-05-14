import * as Yup from 'yup';
import get from 'lodash/get';

Yup.addMethod(Yup.array, 'uniqueItem', function a(message, path) {
  return this.test('uniqueItem', message, function b(list) {
    const mapper = x => get(x, path);
    const set = [...new Set(list.map(mapper))];
    const isUnique = list.length === set.length;
    if (isUnique) {
      return true;
    }

    const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    return this.createError({ path: `${this.path}[${idx}].${path}`, message });
  });
});

export default Yup.object().shape({
  title: Yup.string()
    .min(2, 'Your input length should be between 2 and 64 symbols.')
    .max(64, 'Your input length should be between 2 and 64 symbols.')
    .required(),
  internal_name: Yup.string()
    .min(2, 'Your input length should be between 2 and 64 symbols.')
    .max(64, 'Your input length should be between 2 and 64 symbols.')
    .nullable(),
  number_of_choices_min: Yup.number().when('number_of_choices', (numberOfChoices, schema) => {
    if (numberOfChoices !== 'minMax') {
      return schema.notRequired();
    }

    return schema.typeError('should be a number')
      .integer('should be an integer')
      .min(0, 'should be between 0 and 8.')
      .max(8, 'should be between 0 and 8.')
      .required('is required.');
  }),
  number_of_choices_max: Yup.number().when(['unlimitedMax', 'number_of_choices'], (unlimitedMax, numberOfChoices, schema) => {
    if (unlimitedMax || numberOfChoices !== 'minMax') {
      return schema.notRequired();
    }

    return schema.typeError('should be a number')
      .when('number_of_choices_min', {
        is: val => val === 0,
        then: Yup.number().typeError('should be a number').min(1, 'should be between 1 and 10.'),
        otherwise: Yup.number().typeError('should be a number').min(Yup.ref('number_of_choices_min'), 'should be greater than or equal to min'),
      })
      .integer('should be an integer.')
      .max(10, 'should be between 1 and 10.')
      .required('is required.');
  }),
  items: Yup.array()
    .of(Yup.object().shape({
      title: Yup.string()
        .min(2, 'Your input length should be between 2 and 32 symbols.')
        .max(32, 'Your input length should be between 2 and 32 symbols.')
        .required('Required field cannot be empty'),
      // There is a yup bug when using number validation in array of objects
      price: Yup.string()
        .test('minMax', 'Your value should be between 0$ and 100$', val => Number(val) >= 0 && Number(val) <= 100)
        .matches(/^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/, {
          message: 'Should be a number',
          excludeEmptyString: true,
        })
        .required('Required'),
    }))
    .uniqueItem('Modifier with same name already exists', 'title')
    .required('You need to add at least one modifier to the list')
    .min(1, 'Minimum of 1 modidier'),
});
