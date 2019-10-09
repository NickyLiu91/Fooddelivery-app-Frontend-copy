import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  // Link,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


import AuthService from 'services/authService';
import { styles } from './Login.styled';

class Login extends Component {
  state = {
    data: {
      email: '',
      password: '',
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
      await AuthService.login();
      this.setState({ loading: false });
    } catch (error) {
      const { response } = error;
      this.setState({
        error: response && response.data && response.data.message ? response.data.message : 'Unknown error',
        loading: false,
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
            Sign in
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
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              color="primary"
              className={classes.submit}
            >
              { loading ? <CircularProgress size={24} /> : 'Sign In' }
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
            </Grid>
            <Typography align="center" color="error">
              { error }
            </Typography>
          </form>
        </div>
        {/* <Box mt={8}>
          <Copyright />
        </Box> */}
      </Container>

    );
  }
}

Login.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
};

export default connect(null, null)(withStyles(styles)(Login));
