import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { listStyles } from './Item.styled';
import { materialClassesType } from 'types';
import { notifyService as notifier } from 'services';
import DeleteIcon from '@material-ui/icons/Delete';
import ItemDeleteDialog from '../Items/ItemDeleteDialog';
import { getErrorMessage } from 'sdk/utils';

class ItemSchedules extends Component {
  state = {
    selectedSchedule: 'null',
    isOpenDeleteDialog: false,
    itemToDelete: null,
    deleting: false,
  };

  handleChange = (event) => {
    this.setState({
      selectedSchedule: event.target.value,
    });
  };

  handleAddSchedule = () => {
    const {
      values,
      setFieldValue,
    } = this.props;
    const { selectedSchedule } = this.state;
    const selectedItem = values.schedules.find((item) => item.id === Number(selectedSchedule));
    const newSchedules = [...values.menu_schedules];
    newSchedules.push(selectedItem);
    setFieldValue('menu_schedules', newSchedules);
  };

  handleDelete = (item) => {
    this.setState({ itemToDelete: item, isOpenDeleteDialog: true });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      const updatedItems =
        this.props.values.menu_schedules.filter((item) => item.id !== this.state.itemToDelete.id);
      this.props.setFieldValue('menu_schedules', updatedItems);
      notifier.showInfo('Item is successfully deleted');
      this.setState({ deleting: false, itemToDelete: null, isOpenDeleteDialog: false });
    } catch (error) {
      this.setState({ deleting: false });
      notifier.showError(getErrorMessage(error));
    }
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  render() {
    const {
      classes,
      values,
      handleBlur,
    } = this.props;
    const {
      isOpenDeleteDialog,
      itemToDelete,
      deleting,
    } = this.state;

    return (
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="p">
                Schedules
              </Typography>
              <FormControl variant="outlined" className={classes.selectModifiers}>
                <Select
                  native
                  name="schedules"
                  value={this.state.selectedSchedule}
                  onChange={this.handleChange}
                  onBlur={handleBlur}
                >
                  <option value="null" label="Select Schedule" />
                  {values.schedules.map(schedule => (
                    <option value={schedule.id} label={schedule.name} key={schedule.id} />
                  ))}
                </Select>
              </FormControl>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={this.handleAddSchedule}
                disabled={this.state.selectedSchedule === 'null' || this.props.values.menu_schedules.some(elem => elem.id === Number(this.state.selectedSchedule))}
              >
                Add Schedule
              </Button>
              <List>
                {values.menu_schedules.map((item) => (
                  <ListItem key={item.id} className={classes.itemSchedule}>
                    <ListItemText primary={item.name} />
                    <Tooltip title="Delete">
                      <IconButton aria-label="delete" onClick={() => { this.handleDelete(item); }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
              {
                values.section_schedules &&
                !!values.section_schedules.length &&
                <>
                  <Typography variant="h6">
                    Section schedules:
                  </Typography>
                  <List>
                    {values.section_schedules.map((schedule) => (
                      <ListItem key={schedule.id} className={classes.itemSchedule}>
                        <ListItemText primary={schedule.name} />
                      </ListItem>
                    ))}
                  </List>
                </>
              }
              <ItemDeleteDialog
                isOpen={isOpenDeleteDialog}
                handleDeleteClose={this.handleDeleteClose}
                handleDeleteConfirm={this.handleDeleteConfirm}
                itemToDelete={itemToDelete}
                deleting={deleting}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

ItemSchedules.propTypes = {
  classes: materialClassesType.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
};

export default withStyles(listStyles)(ItemSchedules);
