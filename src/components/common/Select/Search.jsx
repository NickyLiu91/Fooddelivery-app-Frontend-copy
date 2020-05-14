import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import _ from 'lodash';

import { useTheme } from '@material-ui/core/styles';
import components from './selectComponents';
import { useStyles, selectStyles } from './Select.styled';

import HttpModel from 'sdk/api/HttpModel';
import { formQueryString, getErrorMessage } from 'sdk/utils';
import { notifyService } from 'services';


const fetchOptions = async (value, callback, searchApiUrl) => {
  try {
    const { data } = await HttpModel.get(`${searchApiUrl}${formQueryString({ search: value })}`);
    callback(data);
  } catch (error) {
    console.log('error', error.response);
    notifyService.showError(getErrorMessage(error));
    callback(null, { options: [] });
  }
};

const debouncedFetchOptions = _.debounce(fetchOptions, 500);

// eslint-disable-next-line consistent-return
const getOptions = (value, callback, searchApiUrl) => {
  if (_.isEmpty(value) || !value.trim()) {
    return callback(null, { options: [] });
  }
  debouncedFetchOptions(value, callback, searchApiUrl);
};

const propTypes = {
  searchApiUrl: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  optionLabel: PropTypes.string,
  optionValue: PropTypes.string,
  optionLabelCallback: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValue: PropTypes.any,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

function Search({
  searchApiUrl,
  label,
  placeholder,
  optionLabel,
  optionLabelCallback,
  optionValue,
  onChange,
  initialValue,
  error,
  helperText,
  ...rest
}) {
  const [value, setValue] = useState(initialValue);
  const classes = useStyles();
  const theme = useTheme();
  const styles = selectStyles(theme);

  const handleChange = newValue => {
    setValue(newValue);
    onChange(newValue);
  };

  const getOptionLabel = useMemo(() => {
    if (optionLabelCallback) return optionLabelCallback;
    return o => o[optionLabel];
  }, [optionLabel, optionLabelCallback]);

  return (
    <AsyncSelect
      cacheOptions
      classes={classes}
      components={components}
      styles={styles}
      inputId="search-select"
      TextFieldProps={{
        error,
        helperText,
        label,
        InputLabelProps: {
          htmlFor: 'search-select',
          shrink: true,
        },
      }}
      isClearable
      getOptionLabel={getOptionLabel}
      getOptionValue={o => o[optionValue]}
      placeholder={placeholder}
      loadOptions={(...props) => getOptions(...props, searchApiUrl)}
      onChange={handleChange}
      value={value}
      {...rest}
    />
  );
}

Search.propTypes = propTypes;

Search.defaultProps = {
  placeholder: 'Start typing...',
  optionValue: 'id',
  optionLabel: 'name',
  initialValue: '',
  error: false,
  helperText: null,
  optionLabelCallback: null,
};

export default Search;
