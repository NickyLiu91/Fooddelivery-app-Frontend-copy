import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { styles } from './index.styled';
import { withStyles } from '@material-ui/styles';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import { materialClassesType } from 'types';
import PropTypes from 'prop-types';

function DefaultLayout(props) {
  const {
    classes,
    children,
    fullScreen,
  } = props;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header classes={classes} />
      <Sidebar />
      <main
        style={fullScreen ? { paddingLeft: 0, paddingRight: 0 } : null}
        className={classes.content}
      >
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

DefaultLayout.propTypes = {
  classes: materialClassesType.isRequired,
  children: PropTypes.node.isRequired,
  fullScreen: PropTypes.bool,
};

DefaultLayout.defaultProps = {
  fullScreen: false,
};

export default withStyles(styles)(DefaultLayout);
