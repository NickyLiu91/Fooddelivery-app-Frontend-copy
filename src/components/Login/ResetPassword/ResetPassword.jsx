import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


import AuthService from 'services/authService';
import { styles } from '../Login.styled';
import { materialClassesType, routerHistoryType } from 'types';
import { notifyService } from 'services';
import ROUTES from 'constants/routes';

class ResetPassword extends Component {
  state = {
    data: {
      email: '',
    },
    error: null,
    loading: false,
  }

  onInputChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });
  }

  onSubmit = async e => {
    e.preventDefault();
    try {
      this.setState({ loading: true, error: '' });
      await AuthService.resetPassword(this.state.data.email);
      this.setState({ loading: false });
      notifyService.showSuccess('We successfully sent you the email with a link to reset password.');
      this.props.history.push(ROUTES.LOGIN);
    } catch (error) {
      this.setState({ loading: false });
      this.handleError(error);
    }
  }

  handleError = err => {
    console.log('err', err);
    const { response } = err;
    if (response && response.data) {
      if (response.data.errors) {
        this.setState({
          // waiting for errors description...
          error: response.data.errors.email,
        });
      } else {
        notifyService.showError(response.data.message);
        this.props.history.push(ROUTES.LOGIN);
      }
    } else {
      this.setState({
        error: 'Unknown error',
      });
    }
  }

  render() {
    const { error, data, loading } = this.state;
    const { classes } = this.props;

    return (

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <form className={classes.form} onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={data.email}
              onChange={this.onInputChange}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              color="primary"
              className={classes.submit}
            >
              { loading ? <CircularProgress size={24} /> : 'Reset Password' }
            </Button>
            <Typography align="center" color="error">
              { error }
            </Typography>
          </form>
        </div>
      </Container>

    );
  }
}

ResetPassword.propTypes = {
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
};

export default connect(null, null)(withStyles(styles)(ResetPassword));
