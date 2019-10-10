export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(param) ? urlParams.get(param) : null;
};
