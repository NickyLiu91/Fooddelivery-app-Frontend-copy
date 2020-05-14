import React, { Component } from 'react';
import { connect } from 'react-redux';
import { materialClassesType } from 'types';
import parse from 'html-react-parser';
import { convertToHTML } from 'draft-convert';

import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/styles';
import { listStyles } from './TermsAndConditions.styled';
import DefaultLayout from '../Layouts/DefaultLayout/index';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';
import { notifyService, TermsAndConditionsService } from 'services';
import { getErrorMessage } from 'sdk/utils';

class TermsAndConditions extends Component {
  state = {
    isOpenDialog: false,
    termsAndConditionsLoading: false,
    termsAndConditions: '',
  };

  componentDidMount() {
    this.getTermsAndConditions();
  }

  getTermsAndConditions = async () => {
    this.setState({ termsAndConditionsLoading: true });
    try {
      const { content } = await TermsAndConditionsService.getTerms();
      this.setState({
        termsAndConditions: content || '',
        termsAndConditionsLoading: false,
      });
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
    }
  };

  handleOpen = () => {
    this.setState({ isOpenDialog: true });
  };

  handleClose = () => {
    this.setState({
      isOpenDialog: false,
    });
  };

  handleSubmit = async ({ terms_and_conditions: rawTerms }, { setSubmitting }) => {
    try {
      const data = convertToHTML(rawTerms.getCurrentContent());
      const { content } = await TermsAndConditionsService.updateTerms(data);
      this.setState({ termsAndConditions: content });
      notifyService.showSuccess('New data is successfully saved');
      this.handleClose();
      setSubmitting(false);
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
    }
  };

  render() {
    const {
      isOpenDialog,
      termsAndConditionsLoading,
      termsAndConditions,
    } = this.state;

    const { classes } = this.props;

    return (
      <DefaultLayout>
        <Container>
          {!termsAndConditionsLoading ? (
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Terms and conditions"
                  className={classes.cardHeader}
                  action={
                    <TermsAndConditionsDialog
                      defaultData={{ terms_and_conditions: termsAndConditions }}
                      handleSubmitData={this.handleSubmit}
                      isOpen={isOpenDialog}
                      handleClose={this.handleClose}
                      handleOpen={this.handleOpen}
                    />
                  }
                />
                <CardContent>
                  <Typography component="h5">
                    {termsAndConditions && termsAndConditions !== '<p></p>' ? parse(termsAndConditions) : 'No terms and conditions'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <div className={classes.progressContainer}>
              <CircularProgress />
            </div>
          )}
        </Container>
      </DefaultLayout>
    );
  }
}

TermsAndConditions.propTypes = {
  classes: materialClassesType.isRequired,
};

export default connect(null)(withStyles(listStyles)(TermsAndConditions));
