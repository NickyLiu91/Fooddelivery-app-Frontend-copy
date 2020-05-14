import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import PropTypes from 'prop-types';
import ItemDeleteDialog from '../Items/ItemDeleteDialog';

class ItemLabels extends Component {
  state = {
    selectedLabel: 'null',
    isOpenDeleteDialog: false,
    itemToDelete: null,
    deleting: false,
  };

  handleChange = (event) => {
    this.setState({
      selectedLabel: event.target.value,
    });
  };

  handleAddLabel = () => {
    const {
      values,
      setFieldValue,
    } = this.props;
    const { selectedLabel } = this.state;
    const selectedItem = values.labels.find((item) => item.id === Number(selectedLabel));
    const newLabels = [...values.menu_labels];
    newLabels.push(selectedItem);
    setFieldValue('menu_labels', newLabels);
  };

  handleDelete = (item) => {
    this.setState({ itemToDelete: item, isOpenDeleteDialog: true });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      const updatedItems =
        this.props.values.menu_labels.filter((item) => item.id !== this.state.itemToDelete.id);
      this.props.setFieldValue('menu_labels', updatedItems);
      notifier.showInfo('Item is successfully deleted');
      this.setState({ deleting: false, itemToDelete: null, isOpenDeleteDialog: false });
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
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
                Labels
              </Typography>
              <FormControl variant="outlined" className={classes.selectModifiers}>
                <Select
                  native
                  name="labels"
                  value={this.state.selectedLabel}
                  onChange={this.handleChange}
                  onBlur={handleBlur}
                >
                  <option value="null" label="Select Label" />
                  {values.labels.map(label => (
                    <option value={label.id} label={label.name} key={label.id} />
                  ))}
                </Select>
              </FormControl>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={this.handleAddLabel}
                disabled={this.state.selectedLabel === 'null' || this.props.values.menu_labels.some(elem => elem.id === Number(this.state.selectedLabel))}
              >
                Add Label
              </Button>
              <List>
                {this.props.values.menu_labels.map((item) => (
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

ItemLabels.propTypes = {
  classes: materialClassesType.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
};

export default connect(null, null)(withStyles(listStyles)(ItemLabels));
