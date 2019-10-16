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
import { materialClassesType, routerHistoryType, routerMatchType } from 'types';
import { notifyService } from 'services';
import ROUTES from 'constants/routes';

class ConfirmPassword extends Component {
  state = {
    data: {
      password: '',
      confirmPassword: '',
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
    const { password, confirmPassword } = this.state.data;
    const { token } = this.props.match.params;
    const error = this.validateForm({ password, confirmPassword });
    this.setState({ error });
    if (!error) {
      try {
        this.setState({ loading: true, error: '' });
        await AuthService.confirmPassword({ token, password });
        this.setState({ loading: false });
        notifyService.showSuccess('Password successfully changed');
        this.props.history.push(ROUTES.LOGIN);
      } catch (err) {
        this.setState({ loading: false });
        this.handleError(err);
      }
    }
  }

  validateForm = ({ password, confirmPassword }) => {
    const minMaxLength = /^[\s\S]{8,20}$/;
    const letters = /[a-zA-Z]/;
    const numbers = /[0-9]/;

    if (password !== confirmPassword) return 'Passwords don\'t match';
    if (!minMaxLength.test(password)) {
      return 'Password must be at least 8 characters long, but no longer than 20 characters';
    }

    if (!letters.test(password) || !numbers.test(password)) {
      return 'Password must contain letters and numbers.';
    }
    return null;
  }

  handleError = err => {
    console.log('err', err);
    const { response } = err;
    if (response && response.data) {
      if (response.data.errors) {
        this.setState({
          // waiting for errors description...
          error: response.data.errors.new_pas,
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
            Set New Password
          </Typography>
          <form className={classes.form} onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={data.password}
              onChange={this.onInputChange}
              type="password"
              id="password"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              value={data.confirmPassword}
              onChange={this.onInputChange}
              type="password"
              id="confirmPassword"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              color="primary"
              className={classes.submit}
            >
              { loading ? <CircularProgress size={24} /> : 'Set New Password' }
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

ConfirmPassword.propTypes = {
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
  match: routerMatchType.isRequired,
};

export default connect(null, null)(withStyles(styles)(ConfirmPassword));
