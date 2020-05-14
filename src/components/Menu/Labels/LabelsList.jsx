import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { styles } from './Labels.styled';
import { materialClassesType, routerHistoryType } from 'types';
import { Loader } from 'components/common';
import PropTypes from 'prop-types';
import ROUTES from 'constants/routes';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withRouter } from 'react-router-dom';
import { LabelsService, notifyService } from 'services';
import LabelsDeleteDialog from './LabelsDeleteDialog';
import AddIcon from '@material-ui/icons/Add';

class LabelsList extends Component {
  state = {
    checked: [],
    labelsLoading: false,
    labelsList: [],
    isOpenDeleteDialog: false,
    labelToDelete: null,
    deleting: false,
    isDeleteSeveralLabels: false,
  };

  componentDidMount() {
    this.getLabelsList();
  }

  getLabelsList = async () => {
    this.setState({ labelsLoading: true });
    try {
      const labels = await LabelsService.getLabelsList(this.props.restaurant.id);
      this.setState({
        labelsList: labels.result,
        labelsLoading: false,
      });
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleToggle = (value) => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleAddLabels = async () => {
    this.props.history.push(`${ROUTES.MENU_LABELS}/add`);
  };

  handleEditLabel = (label) => {
    this.props.history.push(`${ROUTES.MENU_LABELS}/${label.id}/edit`);
  };

  handleDelete = (label) => {
    this.setState({
      labelToDelete: label,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      await LabelsService.deleteLabel(
        this.props.restaurant.id,
        this.state.labelToDelete.id,
      );
      notifyService.showInfo('Label is successfully deleted');
      this.setState({
        deleting: false,
        labelToDelete: null,
        isOpenDeleteDialog: false,
      });
      this.getLabelsList();
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

  handleDeleteSeveralLabels = () => {
    this.setState({
      labelToDelete: { name: 'labels' },
      isDeleteSeveralLabels: true,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteSeveralLabelsConfirm = async () => {
    this.setState({ deleting: true });
    const checkedLabels = this.state.checked.map((id) => `id[]=${id}&`);
    const checkedId = checkedLabels.join('');
    try {
      await LabelsService.deleteSeveralLabels(
        this.props.restaurant.id,
        checkedId,
      );
      this.setState({
        deleting: false,
        isOpenDeleteDialog: false,
        checked: [],
      });
      notifyService.showInfo('Labels are successfully deleted');
      this.getLabelsList();
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  render() {
    const { classes } = this.props;
    const {
      labelsList,
      labelsLoading,
      labelToDelete,
      isOpenDeleteDialog,
      deleting,
      checked,
      isDeleteSeveralLabels,
    } = this.state;

    return (
      <Fragment>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              {`Labels (${labelsList.length})`}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              size="large"
              variant="contained"
              color="secondary"
              disabled={checked.length === 0}
              className={classes.deleteButton}
              onClick={this.handleDeleteSeveralLabels}
            >
              Delete
            </Button>
            <Button
              startIcon={<AddIcon />}
              size="large"
              variant="contained"
              color="primary"
              onClick={this.handleAddLabels}
            >
              Add label
            </Button>
          </Grid>
        </Grid>
        {labelsLoading ? (
          <Loader />
        ) : (
          <Grid container spacing={1}>
            {labelsList.map(label => (
              <Grid item md={12} key={label.id}>
                <Paper className={classes.paper}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                      <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                          <Checkbox
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            onClick={() => {
                              this.handleToggle(label.id);
                            }}
                          />
                        </Grid>
                        <Grid item className={classes.paperHeader}>
                          <Typography variant="h6" gutterBottom>
                            {label.name}
                          </Typography>
                          <Typography>
                            {label.description}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Edit" onClick={() => this.handleEditLabel(label)}>
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" onClick={() => this.handleDelete(label)}>
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        <LabelsDeleteDialog
          isOpen={isOpenDeleteDialog}
          handleDeleteClose={this.handleDeleteClose}
          handleDeleteConfirm={
            isDeleteSeveralLabels ?
            this.handleDeleteSeveralLabelsConfirm :
            this.handleDeleteConfirm
          }
          labelToDelete={labelToDelete}
          deleting={deleting}
        />
      </Fragment>
    );
  }
}

LabelsList.propTypes = {
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


export default connect(mapStateToProps, null)(withStyles(styles)(withRouter(LabelsList)));
