import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Paper, InputBase, InputAdornment, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/styles';

import { materialClassesType } from 'types';
import { listStyles } from './Orders.styled';

function SearchOrdersInput({ classes, onChange }) {
  const [input, setInput] = useState('');

  const debouncedOnChange = useCallback(debounce(onChange, 500), [onChange]);

  function handleInputChange(e) {
    setInput(e.target.value);
    debouncedOnChange(e.target.value);
  }

  function handleClearInput() {
    if (input) {
      setInput('');
      debouncedOnChange('');
    }
  }

  return (
    <Paper component="form" className={classes.search}>
      <InputBase
        placeholder="Order ID or Customer"
        value={input}
        onChange={handleInputChange}
        startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
      />
      <IconButton className={classes.iconButton} onClick={handleClearInput}>
        <ClearIcon />
      </IconButton>
    </Paper>
  );
}

SearchOrdersInput.propTypes = {
  classes: materialClassesType.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(listStyles)(SearchOrdersInput);

