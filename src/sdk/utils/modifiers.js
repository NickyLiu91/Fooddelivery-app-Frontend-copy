export const prepareModifier = data => {
  const isMinMax = data.number_of_choices === 'minMax';
  const prepared = {
    title: data.title,
    internal_name: data.internal_name,
    items: data.items,
    number_of_choices: isMinMax ? null : data.number_of_choices,
    required_choice: data.required_choice === 'true',
  };
  if (isMinMax) {
    prepared.number_of_choices_min = Number(data.number_of_choices_min);
    prepared.number_of_choices_max = data.unlimitedMax ?
      -1 : Number(data.number_of_choices_max);
  }
  prepared.items = data.items.map((item, index) => {
    const parsedItem = {
      title: item.title,
      price: item.price,
      position: index,
    };
    if (item.id) parsedItem.id = item.id;
    return parsedItem;
  });
  return prepared;
};

export const parseModifier = data => {
  const parsed = {
    ...data,
    number_of_choices_min: data.number_of_choices_min === null ?
      0 : data.number_of_choices_min,
    number_of_choices_max: data.number_of_choices_max === null ?
      1 : data.number_of_choices_max,
    number_of_choices: data.number_of_choices === null ?
      'minMax' : data.number_of_choices,
    unlimitedMax: data.number_of_choices_max === -1,
    internal_name: data.internal_name === null ? '' : data.internal_name,
  };
  if (parsed.unlimitedMax) {
    parsed.number_of_choices_max = parsed.number_of_choices_min ? parsed.number_of_choices_min : 1;
  }
  // remove on backend updates
  if (data.visibility || data.visibility === false) {
    parsed.required_choice = data.visibility ? 'true' : 'false';
  } else {
    parsed.required_choice = data.required_choice ? 'true' : 'false';
  }
  return parsed;
};
