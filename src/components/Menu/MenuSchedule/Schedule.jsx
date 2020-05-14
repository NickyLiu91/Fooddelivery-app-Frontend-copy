import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { styles } from './MenuSchedule.styled';
import { materialClassesType, routerHistoryType } from 'types';
import { Loader } from 'components/common';
import { MenuScheduleService, notifyService } from 'services';
import PropTypes from 'prop-types';
import ROUTES from 'constants/routes';
import { WEEK_DAYS } from 'constants/schedules';
import ScheduleDeleteDialog from './ScheduleDeleteDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withRouter } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';

class Schedule extends Component {
  state = {
    schedules: [],
    hoursLoading: false,
    isOpenDeleteDialog: false,
    scheduleToDelete: null,
    deleting: false,
  };

  componentDidMount() {
    this.getSchedules();
  }

  getSchedules = async () => {
    this.setState({ hoursLoading: true });
    try {
      const data = await MenuScheduleService.getSchedules(this.props.restaurant.id);
      this.setState({
        schedules: data.result,
        hoursLoading: false,
      });
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleAddSchedule = async () => {
    this.props.history.push(`${ROUTES.MENU_SCHEDULE}/add`);
  };

  handleEditSchedule = (schedule) => {
    this.props.history.push(`${ROUTES.MENU_SCHEDULE}/${schedule.id}/edit`);
  };

  handleDelete = (schedule) => {
    this.setState({
      scheduleToDelete: schedule,
      isOpenDeleteDialog: true,
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
      this.getSchedules();
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      hoursLoading,
      schedules,
      scheduleToDelete,
      isOpenDeleteDialog,
      deleting,
    } = this.state;

    return (
      <Fragment>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              {`Schedules (${schedules.length})`}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              startIcon={<AddIcon />}
              size="large"
              variant="contained"
              color="primary"
              onClick={this.handleAddSchedule}
            >
              Add Schedule
            </Button>
          </Grid>
        </Grid>
        {hoursLoading ? (
          <Loader />
        ) : (
          <Grid container spacing={1}>
            {schedules.map(scheduleItems => (
              <Grid item md={12} key={scheduleItems.id}>
                <Paper className={classes.paper}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h6" gutterBottom className={classes.paperHeader}>
                        {scheduleItems.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Edit" onClick={() => this.handleEditSchedule(scheduleItems)}>
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" onClick={() => this.handleDelete(scheduleItems)}>
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Divider />
                  <List>
                    {scheduleItems.menu_schedule_items.map(item => (
                      <React.Fragment key={item.week_day}>
                        <ListItem key={item.week_day}>
                          <ListItemText
                            primary={
                              <Grid container>
                                <Grid item xs={5}>{WEEK_DAYS[item.week_day]}</Grid>
                                <Grid item xs={7}>
                                  <Typography align="right">
                                    {`${item.from} - ${item.to}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        <ScheduleDeleteDialog
          isOpen={isOpenDeleteDialog}
          handleDeleteClose={this.handleDeleteClose}
          handleDeleteConfirm={this.handleDeleteConfirm}
          scheduleToDelete={scheduleToDelete}
          deleting={deleting}
        />
      </Fragment>
    );
  }
}

Schedule.propTypes = {
  classes: materialClassesType.isRequired,
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  history: routerHistoryType.isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});


export default connect(mapStateToProps, null)(withStyles(styles)(withRouter(Schedule)));
