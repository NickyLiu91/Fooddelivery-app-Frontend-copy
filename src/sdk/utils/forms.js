import debounce from 'lodash/debounce';

export const createFakeEvent = ({ name = '', value = '' }) => ({ target: { name, value } });

export const debounceEventHandler = (...args) => {
  const debounced = debounce(...args);
  return function result(e) {
    e.persist();
    return debounced(e);
  };
};
