/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { useTheme } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import components from './selectComponents';
import { useStyles, selectStyles } from './Select.styled';

export default function Select(props) {
  const {
    data,
    value,
    label,
    placeholder,
    onChange,
    isLoading,
    isClearable,
    isSearchable,
    isMulti,
    ...rest
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const styles = selectStyles(theme);

  const cleanValue =
    typeof ((value === 'string' && value.length) || value === 'number') && !isMulti
      ? data.find(option => option.value === value)
      : value;

  return (
    <div className={classes.root}>
      <NoSsr>
        <ReactSelect
          classes={classes}
          styles={styles}
          inputId="react-select"
          TextFieldProps={{
            label,
            InputLabelProps: {
              htmlFor: 'react-select',
              shrink: true,
            },
          }}
          placeholder={placeholder}
          options={data}
          components={components}
          value={cleanValue}
          onChange={val => onChange(val)}
          isLoading={isLoading}
          isClearable={isClearable}
          isMulti={isMulti}
          isSearchable={isSearchable}
          {...rest}
        />
      </NoSsr>
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  isClearable: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  isSearchable: PropTypes.bool,
  value: PropTypes.any,
};

Select.defaultProps = {
  isClearable: true,
  isMulti: false,
  isSearchable: true,
  isLoading: false,
};
