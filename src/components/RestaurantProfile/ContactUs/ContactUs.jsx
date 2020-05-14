import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ContactUsDialog from './ContactUsDialog';
import { useStyles } from '../RestaurantProfile.styled';

function ContactUs(props) {
  const {
    phone,
    email,
    contactPerson,
    openHandler,
    closeHandler,
    isOpen,
    submitHandler,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={4}>
      <Card>
        <CardHeader
          title="Contact us"
          className={classes.data}
          action={
            <Tooltip title="Edit" onClick={openHandler}>
              <IconButton aria-label="edit">
                <EditIcon />
              </IconButton>
            </Tooltip>
            }
        />
        <CardContent>
          <Typography
            color="textSecondary"
            className={classes.additionalInformation}
            component="p"
          >
              This information will be visible on the Contact Us page
          </Typography>
          <Typography variant="h6" component="p">
              Phone:
          </Typography>
          <Typography>
            {phone}
          </Typography>
          <Typography variant="h6" component="p">
              Email:
          </Typography>
          <Typography>
            {email}
          </Typography>
          <Typography variant="h6" component="p">
              Contact person:
          </Typography>
          <Typography>
            {contactPerson}
          </Typography>
        </CardContent>
      </Card>
      {
        isOpen &&
        <ContactUsDialog
          phone={phone}
          email={email}
          contactPerson={contactPerson}
          isOpen={isOpen}
          closeHandler={closeHandler}
          openHandler={openHandler}
          submitHandler={submitHandler}
        />
      }
    </Grid>
  );
}

ContactUs.defaultProps = {
  phone: '',
  contactPerson: '',
  email: '',
};

ContactUs.propTypes = {
  phone: PropTypes.string,
  contactPerson: PropTypes.string,
  email: PropTypes.string,
  openHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null)(ContactUs);
