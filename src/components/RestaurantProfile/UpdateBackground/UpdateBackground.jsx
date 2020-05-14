import React from 'react';
import { connect } from 'react-redux';
import { Card, CardActionArea, CardActions, CardMedia, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
// import UpdateBackgroundDialog from './UpdateBackgroundDialog';
import defaultImage from '../../../assets/images/default-image.png';
import { backgroundStyles } from '../RestaurantProfile.styled';
import { withStyles } from '@material-ui/styles';
import { materialClassesType } from 'types';
import ImageDialog from 'components/common/ImageDialog/ImageDialog';

function UpdateBackground(props) {
  const {
    openHandler,
    closeHandler,
    isOpen,
    classes,
    onSubmit,
    image,
  } = props;

  return (
    <Grid item xs={12}>
      <Card>
        <CardActionArea>
          <CardMedia
            className={`${classes.media} ${!image ? classes.autoBackgoundSize : ''}`}
            image={image || defaultImage}
            onClick={openHandler}
          />
        </CardActionArea>
        <CardActions>
          <ImageDialog
            allowDelete={!!image}
            isOpen={isOpen}
            onSubmit={onSubmit}
            closeHandler={closeHandler}
            openHandler={openHandler}
            resolution="1000x375"
          />
        </CardActions>
      </Card>
    </Grid>
  );
}

UpdateBackground.propTypes = {
  image: PropTypes.string,
  openHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  classes: materialClassesType.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

UpdateBackground.defaultProps = {
  image: null,
};

export default connect(null)(withStyles(backgroundStyles)(UpdateBackground));
