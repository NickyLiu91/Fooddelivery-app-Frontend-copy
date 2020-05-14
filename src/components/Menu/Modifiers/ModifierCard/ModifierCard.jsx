import React from 'react';
import PropTypes from 'prop-types';

import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Box,
} from '@material-ui/core';
import { materialClassesType } from 'types';

const ModifierCard = ({ modifier, classes, onClick }) => (
  <Card className={classes.card}>
    <CardActionArea
      onClick={onClick}
    >
      <CardContent>
        <Typography className={classes.modifierName} variant="h6">
          {modifier.title} { !!modifier.internal_name &&
            `[${modifier.internal_name}]`
          }
        </Typography>
        <Typography>
          <Box className={classes.optionsAmount} component="span">
            {`${modifier.items.length ? modifier.items.length : 'No'} option${modifier.items.length === 1 ? '' : 's'}`}
          </Box>
          { !!modifier.items.length &&
            `(${modifier.items.map(option => option.title).join(', ')})`
          }
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

ModifierCard.propTypes = {
  modifier: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    internal_name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })),
  }).isRequired,
  classes: materialClassesType.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ModifierCard;
