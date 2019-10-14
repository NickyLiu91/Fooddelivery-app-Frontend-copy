export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(param) ? urlParams.get(param) : null;
};

export const formQueryString = (params = {}) => {
  let queryString = '';

  Object.entries(params).forEach(([param, value]) => {
    if (value || value === 0) {
      if (!queryString) {
        queryString += '?';
      } else {
        queryString += '&';
      }

      queryString += `${encodeURIComponent(param)}=${encodeURIComponent(value)}`;
    }
  });

  return queryString;
};

export const updateQueryParams = (params = {}) => {
  const searchParams = new URLSearchParams(window.location.search);
  Object.entries(params).forEach(([key, value]) => {
    if (value || value === 0) {
      searchParams.set(key, value);
    }
  });
  return `?${searchParams.toString()}`;
};
