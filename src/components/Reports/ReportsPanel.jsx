import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';

import {
  Button,
  FormControl,
  Grid,
  Select as MaterialSelect,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { materialClassesType, routerLocationType } from 'types';
import { listStyles } from './Reports.styled';
import { DATE_PATTERN } from 'constants/moment';
import ROUTES from 'constants/routes';
import { notifyService, ReportsService, RestaurantsService } from 'services';
import { getErrorMessage } from 'sdk/utils';
import { USER_ROLES } from 'constants/auth';
import { Select, DatePickerField } from 'components/common';


class ReportsPanel extends Component {
  state = {
    exporting: false,
    restaurantsLoading: false,
    restaurants: [],
  }

  componentDidMount() {
    if (this.props.isSuperAdmin) this.getRestaurants();
  }

  onExport = async (values) => {
    try {
      this.setState({ exporting: true });
      const startDate = values.startDate.format(DATE_PATTERN);
      const endDate = values.endDate.format(DATE_PATTERN);
      const {
        location,
        isSuperAdmin,
        userRestaurant,
        selectedRestaurant,
      } = this.props;
      let file;
      const params = {
        start_date: startDate,
        end_date: endDate,
      };
      if (isSuperAdmin && selectedRestaurant.id !== 'all') {
        params.restaurant = selectedRestaurant.id;
      }
      let reportName;
      if (location.pathname === ROUTES.REPORTS) {
        file = await ReportsService.getGeneralFile(params);
        reportName = 'global_report';
      } else {
        file = await ReportsService.getStopsFile(params);
        reportName = 'stops_report';
      }
      const a = document.createElement('a');
      let restaurantName = userRestaurant.name.replace(/ /g, '_');
      if (isSuperAdmin) {
        restaurantName = selectedRestaurant.id === 'all' ?
          'All_Restaurants' : selectedRestaurant.name.replace(/ /g, '_');
      }
      const periodName = startDate === endDate ?
        startDate : `${startDate}_${endDate}`;
      const fileName = `${restaurantName}_${reportName}_${periodName}.xls`;
      document.body.appendChild(a);
      a.style = 'display: none';
      const url = window.URL.createObjectURL(file);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log('[onExport] error', error);
      notifyService.showError(getErrorMessage(error));
    } finally {
      this.setState({ exporting: false });
    }
  }

  getRestaurants = async () => {
    this.setState({
      restaurantsLoading: true,
    });
    try {
      const data = await RestaurantsService.getRestaurantsList();
      this.setState({
        restaurants: [
          { id: 'all', name: 'All restaurants' },
          ...data,
        ],
        restaurantsLoading: false,
      });
    } catch (error) {
      console.log('[getRestaurants] error', error);
      this.setState({ restaurantsLoading: false });
      notifyService.showError(getErrorMessage(error));
    }
  }

  handleOptionChange = (e, handleChange) => {
    handleChange(e);
    const dates = {};
    switch (e.target.value) {
      case 'day':
        dates.startDate = moment();
        dates.endDate = moment();
        break;
      case 'month':
        dates.startDate = moment().startOf('month');
        dates.endDate = moment();
        break;
      case 'year':
        dates.startDate = moment().startOf('year');
        dates.endDate = moment();
        break;
      default:
        break;
    }
    if (dates.startDate) {
      handleChange({ target: { name: 'startDate', value: dates.startDate } });
      handleChange({ target: { name: 'endDate', value: dates.endDate } });
    }
  }

  restaurantChangeHandler = restaurant => {
    this.props.onRestaurantChange(restaurant);
  }

  render() {
    const {
      classes,
      userRestaurant,
      isSuperAdmin,
      selectedRestaurant,
      period,
      onPeriodChange,
    } = this.props;
    const {
      exporting,
      restaurantsLoading,
      restaurants,
    } = this.state;

    return (
      <Box>
        <Box mb={2}>
          {
          isSuperAdmin ?
            <Box style={{ maxWidth: '300px' }}>
              <Select
                isLoading={restaurantsLoading}
                data={restaurants}
                value={selectedRestaurant.id}
                label="Restaurant"
                placeholder="Select Restaurant"
                onChange={this.restaurantChangeHandler}
                getOptionValue={r => r.id}
                getOptionLabel={r => r.name}
                optionValue="id"
              />
            </Box> :
            <Typography variant="h6">
              {userRestaurant.name}
            </Typography>
          }
        </Box>
        <Grid
          container
          direction="row"
          alignItems="center"
          className={classes.header}
        >
          <Grid item>
            <Formik
              onSubmit={({ startDate, endDate }) => onPeriodChange({ startDate, endDate })}
              initialValues={period}
            >
              {({ errors, values, handleChange }) => {
                const startInvalid = !values.startDate || !!errors.startDate;
                const endInvalid = !values.endDate || !!errors.endDate;
                return (
                  <Form>
                    <Grid container direction="row" alignItems="center">
                      <Grid item>
                        <FormControl variant="outlined" margin="dense">
                          <MaterialSelect
                            native
                            margin="dense"
                            value={values.option}
                            onChange={(e) => this.handleOptionChange(e, handleChange)}
                            inputProps={{
                              name: 'option',
                            }}
                            className={classes.select}
                          >
                            <option value="day">1 day</option>
                            <option value="month">1 month</option>
                            <option value="year">1 year</option>
                            <option value="custom">custom</option>
                          </MaterialSelect>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <Typography className={classes.titleDate}>
                          From:
                        </Typography>
                      </Grid>
                      <Field
                        name="startDate"
                        component={DatePickerField}
                        disabled={values.option !== 'custom'}
                        className={classes.picker}
                      />
                      <Grid item>
                        <Typography className={classes.titleDate}>
                          To:
                        </Typography>
                      </Grid>
                      <Field
                        name="endDate"
                        component={DatePickerField}
                        disabled={values.option !== 'custom'}
                        className={classes.picker}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.buttonApply}
                        disabled={startInvalid || endInvalid}
                      >
                        Apply
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        disabled={exporting}
                        onClick={() => this.onExport(values)}
                        style={{ minWidth: '150px' }}
                      >
                        {exporting ? <CircularProgress size={24} /> : 'Export to .xls'}
                      </Button>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

ReportsPanel.propTypes = {
  classes: materialClassesType.isRequired,
  userRestaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  onPeriodChange: PropTypes.func.isRequired,
  onRestaurantChange: PropTypes.func.isRequired,
  location: routerLocationType.isRequired,
  period: PropTypes.shape({
    startDate: PropTypes.instanceOf(moment).isRequired,
    endDate: PropTypes.instanceOf(moment).isRequired,
  }).isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  selectedRestaurant: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  userRestaurant: state.auth.user.restaurant,
  isSuperAdmin: state.auth.user.role === USER_ROLES.ROOT,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(listStyles)(ReportsPanel));
