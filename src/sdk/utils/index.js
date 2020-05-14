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

export const getErrorMessage = error => {
  const message = 'Unknown error';
  if (!error || !error.response) {
    return message;
  } else if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return message;
};

export const getFormErrors = error => {
  if (!error || !error.response) {
    return null;
  } else if (error.response && error.response.data && error.response.data.errors) {
    return error.response.data.errors;
  }

  return null;
}

export const convertToPrice = num => num.toLocaleString('en', { useGrouping: false, minimumFractionDigits: 2 });
