import React from 'react';
import { withStyles } from '@material-ui/styles';
import { CircularProgress } from '@material-ui/core';
import { styles } from './Loader.styled';
import { materialClassesType } from 'types';

const Loader = ({ classes, ...rest }) => (
  <div className={classes.root}>
    <CircularProgress {...rest} />
  </div>
);

Loader.propTypes = {
  classes: materialClassesType.isRequired,
};

export default withStyles(styles)(Loader);

