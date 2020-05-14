import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { Button, Container, Grid, Typography, CircularProgress } from '@material-ui/core';
import DefaultLayout from '../Layouts/DefaultLayout/index';

import SettingsCard from './SettingsCard';
import { notifyService, UsersService } from 'services';
import { getErrorMessage } from 'sdk/utils';
import { setUser } from 'actions/authActions';

class Settings extends Component {
  state = {
    settingOrder: 1,
    settingMessages: 1,
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({
      settingOrder: user.order_sound,
      settingMessages: user.message_sound,
    });
  }

  handleSubmitSetting = async ({ settingOrder, settingMessages }, { setSubmitting }) => {
    try {
      const userData = await UsersService.updateSettings(
        this.props.user.id,
        {
          order_sound: settingOrder,
          message_sound: settingMessages,
        },
      );
      this.props.setUser(userData);
      setSubmitting(false);
      notifyService.showSuccess('The new settings are successfully saved');
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
    }
  };

  render() {
    const {
      settingOrder,
      settingMessages,
    } = this.state;

    return (
      <DefaultLayout>
        <Container>
          <Formik
            enableReinitialize
            initialValues={{
              settingOrder: settingOrder || '',
              settingMessages: settingMessages || '',
            }}
            onSubmit={this.handleSubmitSetting}
          >
            {(property) => {
              const {
                values,
                handleChange,
                handleSubmit,
                isSubmitting,
              } = property;
              return (
                <form onSubmit={handleSubmit}>
                  <Grid container>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="h4">
                          Settings
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          disabled={isSubmitting}
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          { isSubmitting ? <CircularProgress size={24} /> : 'Save'}
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <SettingsCard
                        currentValue={values.settingOrder}
                        handleChange={handleChange}
                        name="settingOrder"
                        headerTitle="Incoming order sound"
                        contentTitle="Change the default sound that plays when an incoming order arrives. Click to preview the
                            sound."
                      />
                      <SettingsCard
                        currentValue={
                          values.settingMessages
                        }
                        handleChange={handleChange}
                        name="settingMessages"
                        headerTitle="Incoming messages sound"
                        contentTitle="Change the default sound that plays when an incoming message arrives. Click to preview the
                        sound."
                      />
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        </Container>
      </DefaultLayout>
    );
  }
}

Settings.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    order_sound: PropTypes.number,
    message_sound: PropTypes.number,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  setUser: data => dispatch(setUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
