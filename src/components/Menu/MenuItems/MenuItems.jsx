import React from 'react';
import { Grid } from '@material-ui/core';
import Sections from './Sections/Sections';
import Items from './Items/Items';
import { useStyles } from './MenuItems.styled';

function MenuItems() {
  const classes = useStyles();

  return (
    <Grid className={classes.root} container spacing={2}>
      <Sections />
      <Items />
    </Grid>
  );
}

export default MenuItems;
