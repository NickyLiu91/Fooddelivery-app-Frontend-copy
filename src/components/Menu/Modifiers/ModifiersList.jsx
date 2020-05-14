import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Box, Button, Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { authType, routerHistoryType } from 'types';
import { useStyles } from './styled';
import { Loader } from 'components/common';
import { modifiersService, notifyService } from 'services';
import ModifierCard from './ModifierCard/ModifierCard';
import ROUTES from 'constants/routes';
import { withRouter } from 'react-router-dom';

function ModifiersList({ auth, history }) {
  const classes = useStyles();
  const [modifiers, setModifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modifiersElem, setModifiersElem] = useState(null);


  useEffect(() => {
    function handleEditModifier(id) {
      history.push(`${ROUTES.MODIFIERS}/${id}/edit`);
    }

    if (modifiers.length) {
      setModifiersElem((
        modifiers.map(modifier => (
          <ModifierCard
            key={modifier.id}
            onClick={() => handleEditModifier(modifier.id)}
            modifier={modifier}
            classes={classes}
          />
        ))
      ));
    } else {
      setModifiersElem((
        <Typography variant="h6">
          {'You don\'t have modifiers.'}
        </Typography>
      ));
    }
  }, [modifiers, classes, history]);

  useEffect(() => {
    async function getModifiers() {
      try {
        const { result } = await modifiersService.getModifiersList(auth.user.restaurant.id);
        setModifiers(result);
        setLoading(false);
      } catch (error) {
        console.log('[getModifiers] error', error);
        notifyService.showError((
          error.response
          && error.response.data
          && error.response.data.error.message)
          || 'Unknown error');
      }
    }

    getModifiers();
  }, [auth.user.restaurant.id]);

  return (
    <Fragment>
      <Grid container justify="space-between">
        <Typography variant="h4">
          Modifiers
          <Box ml={1} className={classes.modifiersAmount} component="span">
            {!loading && !!modifiers.length && `${modifiers.length}`}
          </Box>
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => history.push(`${ROUTES.MODIFIERS}/add`)}
        >
          Add Modifier
        </Button>
      </Grid>
      <Box mt={2}>
        {loading ?
          <Loader /> :
          modifiersElem
        }
      </Box>
    </Fragment>
  );
}

ModifiersList.propTypes = {
  auth: authType.isRequired,
  history: routerHistoryType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(ModifiersList));
