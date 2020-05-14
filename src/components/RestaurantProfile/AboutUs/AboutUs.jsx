import React from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import AboutUsDialog from './AboutUsDialog';
import parse from 'html-react-parser';
import { useStyles } from '../RestaurantProfile.styled';

function AboutUs(props) {
  const {
    defaultData,
    openHandler,
    closeHandler,
    isOpen,
    submitHandler,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="About us"
          className={classes.cardHeader}
          action={
            <AboutUsDialog
              isOpen={isOpen}
              closeHandler={closeHandler}
              openHandler={openHandler}
              submitHandler={submitHandler}
              defaultData={defaultData}
            />
            }
        />
        <CardContent>
          <Typography color="textSecondary" className={classes.additionalInformation} component="p">
              This information will be visible on the About Us page
          </Typography>
          <div>
            {(defaultData.about_us) ? parse(defaultData.about_us) : ''}
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}

AboutUs.propTypes = {
  defaultData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  openHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null)(AboutUs);
