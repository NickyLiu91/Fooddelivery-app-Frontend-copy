/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { useTheme } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import components from './selectComponents';
import { useStyles } from './Select.styled';


export default function Select(props) {
  const {
    data,
    label,
    placeholder,
    onChange,
    isLoading,
    isClearable,
    isSearchable,
    isMulti,
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const [option, setOption] = React.useState(null);

  const onSelectChange = value => {
    if (!option || !value || option.value !== value.value) {
      setOption(value);
      onChange(value);
    }
  };

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <ReactSelect
          classes={classes}
          styles={selectStyles}
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
          value={option}
          onChange={onSelectChange}
          isLoading={isLoading}
          isClearable={isClearable}
          isMulti={isMulti}
          isSearchable={isSearchable}
        />
      </NoSsr>
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  isClearable: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  isSearchable: PropTypes.bool,
};

Select.defaultProps = {
  isClearable: true,
  isMulti: false,
  isSearchable: true,
};
