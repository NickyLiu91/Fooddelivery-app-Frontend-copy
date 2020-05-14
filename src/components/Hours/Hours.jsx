import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';
import _ from 'lodash';

import { styles } from './Hours.styled';
import { materialClassesType, authType } from 'types';
import { Loader } from 'components/common';
import { HoursService } from 'services/hoursService';
import { notifyService } from 'services';
import EditCustomModal from './EditCustomModal';
import EditWeeklyModal from './EditWeeklyModal';
import HoursPaper from './HoursPaper';
import { workTimeToString, parseHours, fieldHaveErrors, defaultHours, prepareHours, fillInWeeklyHours, labelValidation } from 'sdk/utils/hours';
import DefaultLayout from 'components/Layouts/DefaultLayout';
import { getErrorMessage } from 'sdk/utils';


class Hours extends Component {
  state = {
    weeklyHours: [],
    editableWeeklyHours: [],
    customHours: [],
    disabledDates: [],
    hoursLoading: false,
    customHoursDialogOpen: false,
    weeklyHoursDialogOpen: false,
    customHoursActiveTabIndex: 0,
    customHoursActiveTab: 'delivery',
    weeklyHoursActiveTabIndex: 0,
    weeklyHoursActiveTab: 'delivery',
    weeklyTimeSplit: {
      delivery: false,
      pickup: false,
    },
    isNewCustomHours: false,
    editableCustomHours: {
      ...defaultHours,
      date: moment(),
      name: '',
      isSplit: false,
    },
    submitting: false,
  }

  componentDidMount() {
    this.getHours();
  }

  onEditCustom = (customHours = null) => {
    let todaySelected = false;
    const disabledDates = this.state.customHours.reduce((acc, obj) => {
      if (obj.date.isSame(moment(), 'date')) todaySelected = true;
      if (customHours && customHours.date.isSame(obj.date, 'date')) return acc;
      return [...acc, obj.date];
    }, []);
    if (!customHours) {
      this.setState({
        customHoursDialogOpen: true,
        isNewCustomHours: true,
        disabledDates,
        editableCustomHours: {
          ...defaultHours,
          date: moment(),
          dateError: todaySelected ? 'This date is already defined. Please select another date.' : null,
          name: '',
          isSplit: false,
        },
      });
    } else {
      this.setState({
        customHoursDialogOpen: true,
        isNewCustomHours: false,
        disabledDates,
        editableCustomHours: {
          ...customHours,
        },
      });
    }
  }


  getHours = async () => {
    this.setState({ hoursLoading: true });
    const restaurantId = this.props.auth.user.restaurant.id;
    try {
      const data = await HoursService.getHours(restaurantId);
      const parsedData = parseHours(data);
      this.setState({
        customHours: parsedData.custom,
        weeklyHours: parsedData.weekly,
        weeklyTimeSplit: parsedData.weeklyTimeSplit,
        hoursLoading: false,
      });
    } catch (error) {
      console.log('[getHours] error', error);
      notifyService.showError(getErrorMessage(error));
    }
  }


  postHours = async () => {
    this.setState({ submitting: true });
    const { weeklyHours, customHours, weeklyTimeSplit } = this.state;
    try {
      const hoursData = prepareHours(weeklyHours, customHours, weeklyTimeSplit);
      await HoursService.updateHours(this.props.auth.user.restaurant.id, hoursData);
      this.setState({
        weeklyHoursDialogOpen: false,
        customHoursDialogOpen: false,
        submitting: false,
      });
      notifyService.showSuccess('Hours are successfully updated');
      this.getHours();
    } catch (error) {
      const { response } = error;
      console.log('[postHours] error response', response);
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
      this.setState({ submitting: false });
    }
  }


  handleCustomSplitChange = () => {
    this.setState({
      editableCustomHours: {
        ...this.state.editableCustomHours,
        isSplit: !this.state.editableCustomHours.isSplit,
      },
    });
  }

  handleCustomHoursDialogClose = () => {
    if (!this.state.submitting) this.setState({ customHoursDialogOpen: false });
  }

  handleWeeklyDialogClose = () => {
    if (!this.state.submitting) this.setState({ weeklyHoursDialogOpen: false });
  }

  handleCustomHoursChange = (type, newHours) => {
    this.setState({
      editableCustomHours: {
        ...this.state.editableCustomHours,
        [type]: newHours,
      },
    });
  }

  handleWeeklyHoursChange = (index, data) => {
    const { editableWeeklyHours, weeklyHoursActiveTab } = this.state;
    const newWeeklyHours = _.cloneDeep(editableWeeklyHours);
    newWeeklyHours[index][weeklyHoursActiveTab] = data;
    this.setState({ editableWeeklyHours: newWeeklyHours });
  }

  handleCustomHoursTabChange = (e, val) => {
    this.setState({
      customHoursActiveTabIndex: val,
      customHoursActiveTab: val === 0 ? 'delivery' : 'pickup',
    });
  }

  handleWeeklyHoursTabChange = (e, val) => {
    this.setState({
      weeklyHoursActiveTabIndex: val,
      weeklyHoursActiveTab: val === 0 ? 'delivery' : 'pickup',
    });
  }

  handleCustomHoursLabelChange = e => {
    let err = null;
    try {
      labelValidation.validateSync(e.target.value);
    } catch (error) {
      err = error.message;
    }
    this.setState({
      editableCustomHours: {
        ...this.state.editableCustomHours,
        name: e.target.value,
        labelError: err,
      },
    });
  }

  handleDateChange = date => {
    this.setState({
      editableCustomHours: {
        ...this.state.editableCustomHours,
        dateError: null,
        date,
      },
    });
  }

  handleEditWeeklyHours = () => {
    this.setState({
      weeklyHoursDialogOpen: true,
      editableWeeklyHours: this.state.weeklyHours.length ?
        this.state.weeklyHours : fillInWeeklyHours(),
    });
  }

  handleWeeklySplitChange = () => {
    const { weeklyTimeSplit, weeklyHoursActiveTab } = this.state;
    this.setState({
      weeklyTimeSplit: {
        ...weeklyTimeSplit,
        [weeklyHoursActiveTab]: !weeklyTimeSplit[weeklyHoursActiveTab],
      },
    });
  }


  handleDeleteCustomHours = () => {
    const { editableCustomHours, customHours } = this.state;
    const filteredCustomHours = customHours.filter(hours => hours.id !== editableCustomHours.id);
    this.setState(
      { customHours: filteredCustomHours },
      () => this.postHours(),
    );
  }

  validateCustomHours = () => {
    const {
      delivery,
      pickup,
      isSplit,
      name,
      labelError,
      dateError,
    } = this.state.editableCustomHours;
    if (!name) {
      this.setState({
        editableCustomHours: {
          ...this.state.editableCustomHours,
          labelError: 'required',
        },
      });
      return { isValid: false, msg: 'Fill in all required fields' };
    }
    if (dateError) return { isValid: false, msg: 'Invalid Date value.' };
    if (fieldHaveErrors(delivery, isSplit)
      || fieldHaveErrors(pickup, isSplit)
      || labelError) {
      return { isValid: false, msg: 'Invalid form value' };
    }
    return { isValid: true };
  }

  validateWeeklyHours = () => {
    const { editableWeeklyHours, weeklyTimeSplit } = this.state;
    for (let i = 0; i < editableWeeklyHours.length; i += 1) {
      const weekDay = editableWeeklyHours[i];
      if (
        fieldHaveErrors(weekDay.delivery, weeklyTimeSplit.delivery) ||
        fieldHaveErrors(weekDay.pickup, weeklyTimeSplit.pickup)
      ) return false;
    }
    return true;
  }

  handleSubmitCustomHours = e => {
    e.preventDefault();
    const {
      editableCustomHours,
      isNewCustomHours,
      customHours,
    } = this.state;
    const validation = this.validateCustomHours();
    if (validation.isValid) {
      if (isNewCustomHours) {
        this.setState(
          { customHours: [...customHours, editableCustomHours] },
          () => this.postHours(),
        );
      } else {
        const newHours = _.cloneDeep(customHours);
        const index = _.findIndex(customHours, { id: editableCustomHours.id });
        newHours[index] = editableCustomHours;
        this.setState(
          { customHours: newHours },
          () => this.postHours(),
        );
      }
    } else {
      notifyService.showWarning(validation.msg);
    }
  }

  handleWeeklySubmit = e => {
    e.preventDefault();
    const { editableWeeklyHours } = this.state;
    if (this.validateWeeklyHours()) {
      this.setState(
        { weeklyHours: editableWeeklyHours },
        () => this.postHours(),
      );
    } else {
      notifyService.showWarning('Invalid form value');
    }
  }


  render() {
    const { classes } = this.props;
    const {
      hoursLoading,
      weeklyHours,
      editableWeeklyHours,
      customHours,
      customHoursDialogOpen,
      editableCustomHours,
      disabledDates,
      customHoursActiveTabIndex,
      customHoursActiveTab,
      isNewCustomHours,
      weeklyHoursActiveTabIndex,
      weeklyHoursActiveTab,
      weeklyTimeSplit,
      weeklyHoursDialogOpen,
      submitting,
    } = this.state;

    return (
      <DefaultLayout>
        <Container>
          <Typography variant="h4" gutterBottom>
            Hours
          </Typography>
          <Grid>
            { hoursLoading ? (
              <Loader />
              ) : (
                <React.Fragment>
                  <HoursPaper
                    label="Weekly hours"
                    classes={classes}
                    buttonLabel="Edit"
                    onEdit={this.handleEditWeeklyHours}
                  >
                    <Tabs
                      value={weeklyHoursActiveTabIndex}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      onChange={this.handleWeeklyHoursTabChange}
                    >
                      <Tab label="Delivery" />
                      <Tab label="Pickup" />
                    </Tabs>
                    <List>
                      { weeklyHours.map(dayOfWeek => (
                        <React.Fragment key={dayOfWeek.day}>
                          <ListItem key={dayOfWeek.day}>
                            <ListItemText
                              primary={
                                <Grid container>
                                  <Grid item xs={5}>{dayOfWeek.day}</Grid>
                                  <Grid item xs={7}>
                                    <Typography align="right">
                                      {workTimeToString(dayOfWeek[weeklyHoursActiveTab])}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      )) }
                    </List>
                  </HoursPaper>

                  <HoursPaper
                    label="Custom hours"
                    buttonLabel="Add"
                    classes={classes}
                    onEdit={() => this.onEditCustom()}
                  >
                    <Tabs
                      value={customHoursActiveTabIndex}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      onChange={this.handleCustomHoursTabChange}
                    >
                      <Tab label="Delivery" />
                      <Tab label="Pickup" />
                    </Tabs>
                    <List>
                      { customHours.map(day => (
                        <React.Fragment key={day.id}>
                          <ListItem key={day.id} button onClick={() => this.onEditCustom(day)}>
                            <ListItemText
                              id={day.id}
                              primary={
                                <Grid container>
                                  <Grid item xs={5}>{day.name} - {moment(day.date).format('MM-DD-YYYY')}</Grid>
                                  <Grid item xs={7}>
                                    <Typography align="right" >
                                      {workTimeToString(day[customHoursActiveTab])}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      )) }
                    </List>
                  </HoursPaper>
                </React.Fragment>
              )}
          </Grid>

          <EditCustomModal
            isOpen={customHoursDialogOpen}
            onClose={this.handleCustomHoursDialogClose}
            classes={classes}
            onSubmit={this.handleSubmitCustomHours}
            onLabelChange={this.handleCustomHoursLabelChange}
            onDateChange={this.handleDateChange}
            onHoursChange={this.handleCustomHoursChange}
            onDelete={this.handleDeleteCustomHours}
            onSplitChange={this.handleCustomSplitChange}
            hoursData={editableCustomHours}
            isNew={isNewCustomHours}
            disabledDates={disabledDates}
            submitting={submitting}
          />

          <EditWeeklyModal
            isOpen={weeklyHoursDialogOpen}
            onClose={this.handleWeeklyDialogClose}
            classes={classes}
            hoursData={editableWeeklyHours}
            onSubmit={this.handleWeeklySubmit}
            onHoursChange={this.handleWeeklyHoursChange}
            activeTab={weeklyHoursActiveTab}
            activeTabIndex={weeklyHoursActiveTabIndex}
            onTabChange={this.handleWeeklyHoursTabChange}
            isSplit={weeklyTimeSplit}
            onSplitChange={this.handleWeeklySplitChange}
            submitting={submitting}
          />
        </Container>
      </DefaultLayout>
    );
  }
}

Hours.propTypes = {
  classes: materialClassesType.isRequired,
  auth: authType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});


export default connect(mapStateToProps, null)(withStyles(styles)(Hours));
