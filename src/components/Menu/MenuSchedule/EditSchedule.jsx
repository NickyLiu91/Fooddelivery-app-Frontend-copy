import React, { Component } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { materialClassesType, routerHistoryType, routerMatchType } from 'types';
import HoursField from './SchedulesField';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { styles } from './MenuSchedule.styled';
import { fillInWeeklyHours, parseData, prepareHours } from 'sdk/utils/schedules';
import DefaultLayout from '../../Layouts/DefaultLayout';
import _ from 'lodash';
import { MenuScheduleService, notifyService } from 'services';
import * as Yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import ROUTES from 'constants/routes';
import ScheduleDeleteDialog from './ScheduleDeleteDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import ItemDeleteDialog from './ItemDeleteDialog';
import { ConfirmLeaving, Search } from 'components/common';
import { MENU_ITEMS_PATH, RESTAURANTS_PATH } from 'constants/apiPaths';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function handleChangeId(index) {
  return {
    id: `tab-${index}`,
  };
}

const validationSchema = () => (
  Yup.object()
    .shape({
      name: Yup.string()
        .test('whitespace', 'Required', (value) => /\S/.test(value))
        .trim()
        .min(3, 'Your input is too short. Minimum length of the name is 3 symbols')
        .max(64, 'Your input is too long. Maximum length of the name is 64 symbols')
        .required('Required'),
      checkbox: Yup.boolean()
        .test('checked week day', 'You should choose at least one week day', (value) => !value),
      time: Yup.boolean()
        .test('checked time', 'Your end time should be later than start time.', (value) => value),
    })
);

class EditWeeklyModal extends Component {
  state = {
    value: 0,
    scheduleHours: fillInWeeklyHours(),
    scheduleName: '',
    scheduleItems: [],
    newSchedule: true,
    scheduleLoading: true,
    isOpenDeleteDialog: false,
    scheduleToDelete: null,
    deleting: false,
    itemToDelete: null,
    isOpenDeleteItemDialog: false,
    itemDeleting: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id || id === 0) {
      this.setState({
        newSchedule: false,
      });
      this.getSchedule(id);
    } else {
      this.setState({
        scheduleLoading: false,
      });
    }
  }

  getSchedule = async (id) => {
    try {
      const data = await MenuScheduleService.getSchedule(this.props.restaurant.id, id);
      this.setState({
        scheduleName: data.name,
        scheduleHours: parseData(data),
        scheduleItems: data.menu_items,
        scheduleLoading: false,
      });
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  handleCancel = () => {
    this.props.history.push(`${ROUTES.MENU_SCHEDULE}`);
  };


  postHours = async (scheduleData, { setSubmitting }) => {
    const scheduleItems = this.state.scheduleItems.map((item) => `${item.id}`);
    const newSchedule = {
      name: scheduleData.name,
      menu_schedule_items:
        prepareHours(this.state.scheduleHours.filter(schedule => schedule.open === true)),
      menu_items: scheduleItems,
    };
    try {
      if (this.state.newSchedule) {
        await MenuScheduleService.postSchedule(this.props.restaurant.id, newSchedule);
      } else {
        await MenuScheduleService.putSchedule(
          this.props.restaurant.id,
          this.props.match.params.id, newSchedule,
        );
      }
      notifyService.showSuccess('Schedule is successfully saved');
      this.handleCancel();
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
      setSubmitting(false);
    }
  };

  handleWeeklyHoursChange = (index, data) => {
    const { scheduleHours } = this.state;
    const newWeeklyHours = _.cloneDeep(scheduleHours);
    newWeeklyHours[index] = data;
    this.setState({
      scheduleHours: newWeeklyHours,
    });
  };

  handleAddItem = (item) => {
    if (item && this.state.scheduleItems.every(x => x.id !== item.id)) {
      const newScheduleItems = this.state.scheduleItems;
      this.setState({
        scheduleItems: [item, ...newScheduleItems],
      });
    }
  };

  handleDelete = (schedule) => {
    this.setState({
      scheduleToDelete: schedule,
      isOpenDeleteDialog: true,
    });
  };

  handleItemDelete = (item) => {
    this.setState({
      itemToDelete: item,
      isOpenDeleteItemDialog: true,
    });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      await MenuScheduleService.deleteSchedule(
        this.props.restaurant.id,
        this.state.scheduleToDelete.id,
      );
      notifyService.showInfo('Schedule is successfully deleted');
      this.setState({
        deleting: false,
        scheduleToDelete: null,
        isOpenDeleteDialog: false,
      });
      this.handleCancel();
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleDeleteItemConfirm = async () => {
    const updatedItems =
      this.state.scheduleItems.filter((item) => item.id !== this.state.itemToDelete.id);
    try {
      this.setState({
        scheduleItems: updatedItems,
        itemToDelete: null,
        isOpenDeleteItemDialog: false,
      });
      notifyService.showInfo('Item is successfully deleted');
      this.handleItemDeleteClose();
    } catch (error) {
      this.setState({ itemDeleting: false });
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  handleItemDeleteClose = () => {
    if (!this.state.itemDeleting) {
      this.setState({ isOpenDeleteItemDialog: false });
    }
  };

  openErrorTab = (values) => {
    const checkMinLength = values.name.length < 3;
    const checkMaxLength = values.name.length > 64;
    if (checkMinLength || checkMaxLength || values.checkbox || !values.time) {
      this.setState({
        value: 0,
      });
    }
  };

  render() {
    const {
      value,
      scheduleLoading,
      scheduleHours,
      newSchedule,
      scheduleToDelete,
      isOpenDeleteDialog,
      deleting,
      scheduleName,
      scheduleItems,
      itemToDelete,
      isOpenDeleteItemDialog,
    } = this.state;
    const { classes } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={{
          name: scheduleName,
          checkbox: this.state.scheduleHours.every(elem => elem.open === false),
          time: this.state.scheduleHours.every(elem => moment(elem.to)
            .isAfter(elem.from)),
        }}
        onSubmit={this.postHours}
        validationSchema={validationSchema()}
      >
        {(property) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            dirty,
            isSubmitting,
          } = property;

          return (
            <DefaultLayout>
              <Container>
                <Card>
                  <CardHeader
                    title="Create new schedule"
                  />
                  <form onSubmit={handleSubmit}>
                    <CardContent>
                      <AppBar position="static">
                        <Tabs
                          value={value}
                          onChange={this.handleChange}
                          aria-label="simple tabs example"
                          variant="fullWidth"
                        >
                          <Tab label="Schedule info" {...handleChangeId(0)} />
                          <Tab label="Items with this schedule" {...handleChangeId(1)} />
                        </Tabs>
                      </AppBar>
                      <TabPanel value={value} index={0}>
                        {!scheduleLoading ? (
                          <div>
                            <Typography variant="h5" className={classes.scheduleInfoTitle}>
                              Schedule name and times
                            </Typography>
                            <Typography variant="h6">
                              Schedule name*
                            </Typography>
                            <TextField
                              name="name"
                              error={errors.name && touched.name}
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={(errors.name && touched.name) && errors.name}
                              margin="normal"
                              fullWidth
                              variant="outlined"
                            />
                            <FormHelperText
                              className={classes.helperText}
                              id="checkbox"
                            >{(errors.checkbox && touched.checkbox) && errors.checkbox}
                            </FormHelperText>
                            <Box mt={3}>
                              {scheduleHours.map((weekDay, index) => (
                                <HoursField
                                  hoursData={weekDay}
                                  onChange={(data) => this.handleWeeklyHoursChange(index, data)}
                                  label={weekDay.week_day}
                                  key={weekDay.week_day}
                                />
                              ))}
                            </Box>
                          </div>
                        ) : (
                          <div className={classes.progressContainer}>
                            <Grid container direction="row" justify="center" alignItems="center">
                              <CircularProgress />
                            </Grid>
                          </div>
                        )}
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <Grid className={classes.search}>
                          <Search
                            label="Find item"
                            placeholder="Start typing..."
                            onChange={(item) => this.handleAddItem(item)}
                            optionLabel="name"
                            searchApiUrl={`${RESTAURANTS_PATH}/${this.props.restaurant.id}${MENU_ITEMS_PATH}`}
                          />
                        </Grid>
                        {scheduleItems.length === 0 ?
                          <Typography variant="h5" className={classes.scheduleInfoTitle}>
                            You have no items
                          </Typography> :
                          <List>
                            {scheduleItems.map((item) => (
                              <ListItem key={item.id} className={classes.scheduleItem}>
                                <ListItemText primary={item.name} />
                                <ListItemSecondaryAction>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      aria-label="delete"
                                      onClick={() => this.handleItemDelete(item)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        }
                      </TabPanel>
                    </CardContent>
                    <CardActions>
                      <Grid container justify="flex-end">
                        {!newSchedule &&
                        <Button
                          color="secondary"
                          variant="contained"
                          className={classes.formButton}
                          type="button"
                          onClick={() => this.handleDelete({
                            name: scheduleName,
                            id: this.props.match.params.id,
                          })}
                        >
                          Delete
                        </Button>
                        }
                        <Button
                          variant="contained"
                          className={classes.formButton}
                          type="button"
                          onClick={this.handleCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          className={classes.formButton}
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => {
                            this.openErrorTab(values);
                          }}
                        >
                          {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
                        </Button>
                        <ConfirmLeaving active={dirty && !isSubmitting} />
                      </Grid>
                    </CardActions>
                  </form>
                </Card>
                <ScheduleDeleteDialog
                  isOpen={isOpenDeleteDialog}
                  handleDeleteClose={this.handleDeleteClose}
                  handleDeleteConfirm={this.handleDeleteConfirm}
                  scheduleToDelete={scheduleToDelete}
                  deleting={deleting}
                />
                <ItemDeleteDialog
                  isOpen={isOpenDeleteItemDialog}
                  handleDeleteClose={this.handleItemDeleteClose}
                  handleDeleteConfirm={this.handleDeleteItemConfirm}
                  scheduleToDelete={itemToDelete}
                  deleting={deleting}
                />
              </Container>
            </DefaultLayout>
          );
        }}
      </Formik>
    );
  }
}

EditWeeklyModal.propTypes = {
  classes: materialClassesType.isRequired,
  match: routerMatchType.isRequired,
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  history: routerHistoryType.isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, null)(withStyles(styles)(EditWeeklyModal));
