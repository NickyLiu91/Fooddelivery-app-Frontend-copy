import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import cloneDeep from 'lodash/cloneDeep';

import { withStyles } from '@material-ui/styles';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { authType, materialClassesType } from 'types';
import DefaultLayout from 'components/Layouts/DefaultLayout';
import ENV from 'config/env';
import { Loader, AlertDialog } from 'components/common';
import { mapContainerStyle, styles, zonesColors } from './Boundaries.styled';
import AddZoneDialog from './AddZoneDialog';
import Polygon from './Polygon';
import EditZoneForm from './EditZoneForm';
import BoundariesList from './BoundariesList';
import { getCircleBounds, getSquareBounds } from 'sdk/utils/boundaries';
import { BoundariesService, notifyService } from 'services';
import { getErrorMessage } from 'sdk/utils';
import { boundaryStatuses } from 'constants/boundaries';
import EditBoundaryDialog from './EditBoundaryDialog';

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: 'cooperative',
  // if we need to remove points of interests from map:
  // styles: [
  //   {
  //     featureType: 'poi',
  //     stylers: [
  //       { visibility: 'off' },
  //     ],
  //   },
  // ],
};

const mapLibraries = ['drawing', 'geometry'];

function getZoneColor(index) {
  return zonesColors[index % zonesColors.length];
}

function getActiveBoundary(list) {
  return list.find(boundary => boundary.status === boundaryStatuses.ACTIVE);
}

class Boundaries extends Component {
  static propTypes = {
    auth: authType.isRequired,
    classes: materialClassesType.isRequired,
  }

  state = {
    boundary: null,
    boundariesLoading: true,
    boundariesList: [],
    newBoundary: false,
    addZoneDialogOpen: false,
    editZoneIndex: null,
    deleteZoneIndex: null,
    showDeleteZoneDialog: false,
    zoneDeleting: false,
    zoneSubmitting: false,
    boundarySubmitting: false,
    editBoundary: {},
    editBoundaryDialogOpen: false,
    deleteBoundaryId: null,
  }

  componentDidMount() {
    this.getBoundaries();
  }

  getBoundaries = async () => {
    this.setState({ boundariesLoading: true });
    try {
      const data = await BoundariesService.getBoundaries();
      this.setState({
        boundariesLoading: false,
        boundariesList: data,
      });
      if (this.viewInit) {
        this.setState({ boundary: getActiveBoundary(data) });
        this.viewInit = false;
      }
    } catch (error) {
      console.log('[getBoundaries] error', error);
      notifyService.showError(getErrorMessage(error));
    }
  }

  handleAddNew = (data) => {
    const center = this.props.auth.user.restaurant.address.location;
    const bounds = data.figure === 'circle' ?
      getCircleBounds(center, Number(data.distance)) :
      getSquareBounds(center, Number(data.distance));
    // eslint-disable-next-line camelcase
    const { name, delivery_fee, additional_delivery_time } = data;
    const boundary = this.state.newBoundary ?
      { name: data.boundaryName, delivery_zones: [] } :
      this.state.boundary;
    this.setState({
      boundary: {
        ...boundary,
        delivery_zones: [
          ...boundary.delivery_zones,
          {
            name, delivery_fee, additional_delivery_time, bounds,
          },
        ],
      },
      addZoneDialogOpen: false,
      editZoneIndex: boundary.delivery_zones.length,
    });
    this.editNewZone = true;
    this.editZoneBounds = bounds;
  }

  editZoneBounds = null
  editNewZone = false
  viewInit = true

  handlePolygonChange = data => {
    this.editZoneBounds = data;
  };

  handleSelectBoundary = boundary => {
    this.setState({ boundary });
  }

  handleSubmitZone = async editedZone => {
    const { editZoneIndex } = this.state;
    const boundary = cloneDeep(this.state.boundary);
    boundary.delivery_zones[editZoneIndex] = editedZone;
    if (this.editZoneBounds) {
      boundary.delivery_zones[editZoneIndex].bounds = this.editZoneBounds;
    }
    this.setState({ zoneSubmitting: true, boundariesLoading: true });
    try {
      if (this.state.newBoundary) {
        const response = await BoundariesService.addBoundary({
          name: boundary.name,
          delivery_zones: boundary.delivery_zones.map(zone => ({
            ...zone,
          })),
          status: boundaryStatuses.INACTIVE,
        });
        this.setState({
          newBoundary: false,
          boundariesList: [
            ...this.state.boundariesList,
            response,
          ],
          boundary: response,
          boundariesLoading: false,
        });
        notifyService.showSuccess('Delivery boundary is successfully added');
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.editNewZone) {
          const zone = {
            ...editedZone,
            bounds: this.editZoneBounds,
          };
          const response = await BoundariesService.addZone(boundary.id, zone);
          boundary.delivery_zones[editZoneIndex] = response;
          this.setState({ boundary });
          notifyService.showSuccess('Delivery zone is successfully added');
          this.getBoundaries();
        } else {
          const zone = boundary.delivery_zones[editZoneIndex];
          const response = await BoundariesService.updateZone(boundary.id, zone);
          boundary.delivery_zones[editZoneIndex] = response;
          this.setState({ boundary });
          notifyService.showSuccess('Delivery zone is successfully updated');
          this.getBoundaries();
        }
      }
    } catch (error) {
      console.log('[SubmitZone] error', error);
      notifyService.showError(getErrorMessage(error));
    } finally {
      this.setState({
        zoneSubmitting: false,
        editZoneIndex: null,
      });
      this.editNewZone = false;
      this.editZoneBounds = null;
    }
  }

  handleDeleteZone = (index) => {
    this.setState({
      deleteZoneIndex: index,
      showDeleteZoneDialog: true,
    });
  }

  handleDeleteZoneConfirm = async () => {
    this.setState({ zoneDeleting: true, boundariesLoading: true });
    try {
      const { deleteZoneIndex, boundary } = this.state;
      await BoundariesService.deleteZone(boundary.id, boundary.delivery_zones[deleteZoneIndex].id);
      boundary.delivery_zones.splice(deleteZoneIndex, 1);
      this.setState({
        zoneDeleting: false,
        showDeleteZoneDialog: false,
        boundary,
      });
      notifyService.showInfo('Delivery zone is successfully deleted');
      this.getBoundaries();
    } catch (error) {
      console.log('[handleDeleteZoneConfirm] error', error);
      notifyService.showError(getErrorMessage(error));
      this.setState({ zoneDeleting: false, boundariesLoading: false });
    }
  }

  handleCancelEditZone = () => {
    if (this.state.newBoundary) {
      this.setState({ editZoneIndex: null, boundary: null });
    } else {
      const { boundary } = this.state;
      this.setState({
        editZoneIndex: null,
        boundary: !this.editNewZone ? boundary :
          {
            ...boundary,
            delivery_zones: boundary.delivery_zones.splice(0, boundary.delivery_zones.length - 1),
          },
      });
      this.editNewZone = false;
    }
  }

  toggleBoundaryActive = async boundary => {
    const newBoundary = boundary;
    try {
      this.setState({ boundariesLoading: true });
      if (boundary.status === boundaryStatuses.ACTIVE) {
        newBoundary.status = boundaryStatuses.INACTIVE;
        await BoundariesService.updateBoundary(newBoundary);
      } else {
        const activeBoundary = getActiveBoundary(this.state.boundariesList);
        newBoundary.status = boundaryStatuses.ACTIVE;
        if (activeBoundary) {
          await BoundariesService.updateBoundary({
            ...activeBoundary,
            status: boundaryStatuses.INACTIVE,
          });
        }
        await BoundariesService.updateBoundary(newBoundary);
      }
      notifyService.showSuccess('Delivery boundary is successfully updated');
      this.getBoundaries();
    } catch (error) {
      console.log('[toggleBoundaryActive] error', error);
      this.setState({ boundariesLoading: false });
      notifyService.showError(getErrorMessage(error));
    }
  }

  handleBoundaryRename = (boundary) => {
    this.setState({
      editBoundary: boundary,
      editBoundaryDialogOpen: true,
    });
  }

  handleSubmitBoundary = async boundary => {
    try {
      this.setState({ boundariesLoading: true, boundarySubmitting: true });
      await BoundariesService.updateBoundary(boundary);
      this.setState({
        editBoundary: {},
        editBoundaryDialogOpen: false,
        boundarySubmitting: false,
      });
      notifyService.showSuccess('Delivery boundary is successfully updated');
      this.getBoundaries();
      if (this.state.boundary.id === boundary.id) this.setState({ boundary });
    } catch (error) {
      console.log('[handleSubmitBoundary] error', error);
      this.setState({ boundariesLoading: false });
      notifyService.showError(getErrorMessage(error));
    }
  }

  handleBoundaryDelete = ({ id }) => {
    this.setState({ deleteBoundaryId: id });
  }

  handleDeleteBoundaryConfirm = async () => {
    try {
      this.setState({ boundariesLoading: true });
      const { deleteBoundaryId } = this.state;
      await BoundariesService.deleteBoundary(deleteBoundaryId);
      const { boundariesList } = this.state;
      if (
        this.state.boundary &&
        deleteBoundaryId === this.state.boundary.id
      ) {
        const activeBoundary = boundariesList.filter(boundary =>
          boundary.id !== deleteBoundaryId)[0];
        this.setState({
          boundary: activeBoundary,
        });
      }
      this.setState({
        deleteBoundaryId: null,
      });
      notifyService.showInfo('Boundary is successfully deleted');
      this.getBoundaries();
    } catch (error) {
      console.log('[handleDeleteBoundaryConfirm] error', error);
      notifyService.showError(getErrorMessage(error));
    }
  }

  render() {
    const { classes } = this.props;
    const center = this.props.auth.user.restaurant.address.location;
    const {
      boundariesLoading,
      addZoneDialogOpen,
      boundary,
      editZoneIndex,
      deleteZoneIndex,
      zoneDeleting,
      newBoundary,
      boundariesList,
      zoneSubmitting,
      editBoundary,
      editBoundaryDialogOpen,
      boundarySubmitting,
    } = this.state;

    return (
      <DefaultLayout fullScreen>
        <LoadScript
          id="script-loader"
          googleMapsApiKey={ENV.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={mapLibraries}
          loadingElement={<Loader />}
          language="en"
        >
          <Box className={classes.mapWrapper}>
            <GoogleMap
              id="boundaries-map"
              zoom={14}
              center={center}
              options={mapOptions}
              mapContainerStyle={mapContainerStyle}
            >
              <Marker
                position={center}
              />
              {
              boundary &&
              boundary.delivery_zones.map((zone, index) => (
                <Polygon
                  key={zone.name}
                  index={index}
                  editable={editZoneIndex === index}
                  bounds={zone.bounds}
                  onChange={this.handlePolygonChange}
                />
              ))
              }
            </GoogleMap>
            {
            boundary &&
            <Paper className={classes.editPanel}>
              <Typography>
                {
                  editZoneIndex === null ?
                  boundary.name :
                  `Edit '${boundary.delivery_zones[editZoneIndex].name}' zone`
                }
              </Typography>
              <Divider />
              {
            editZoneIndex === null ?
              <Box mt={1}>
                <Grid container justify="flex-end">
                  <Button
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => this.setState({
                      addZoneDialogOpen: true,
                      newBoundary: false,
                    })}
                  >
                    Add zone
                  </Button>
                </Grid>
                <List>
                  {
                  boundary.delivery_zones.map((zone, index) => (
                    <ListItem
                      key={zone.name}
                      dense
                      button
                      onClick={() => this.setState({ editZoneIndex: index })}
                    >
                      <ListItemIcon className={classes.listIcon} >
                        <Avatar
                          variant="rounded"
                          style={{ backgroundColor: getZoneColor(index) }}
                          className={classes.zoneColorAvatar}
                        />
                      </ListItemIcon>
                      <ListItemText className={classes.zoneName}>
                        {zone.name}
                      </ListItemText>
                      {
                        boundary.delivery_zones.length &&
                        boundary.delivery_zones.length > 1 &&
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => this.handleDeleteZone(index)}
                            size="small"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      }
                    </ListItem>
                  ))
                  }
                </List>
              </Box>
              :
              <EditZoneForm
                zone={boundary.delivery_zones[editZoneIndex]}
                onFormSubmit={this.handleSubmitZone}
                isSubmitting={zoneSubmitting}
                onCancel={this.handleCancelEditZone}
              />
              }
            </Paper>
            }
          </Box>
        </LoadScript>
        {
        !boundariesLoading &&
        <Container>
          <Box mt={2}>
            <Grid container justify="flex-end">
              <Button
                color="primary"
                variant="contained"
                onClick={() => this.setState({
                  addZoneDialogOpen: true,
                  newBoundary: true,
                })}
                startIcon={<AddIcon />}
              >
                Add Boundary
              </Button>
            </Grid>
          </Box>
          {
          !!boundariesList.length &&
          <Box mt={2}>
            <BoundariesList
              onSelectBoundary={this.handleSelectBoundary}
              list={boundariesList}
              selectedId={boundary && boundary.id}
              onToggleActive={this.toggleBoundaryActive}
              onEdit={this.handleBoundaryRename}
              onDelete={this.handleBoundaryDelete}
            />
          </Box>
          }
        </Container>
        }
        {
        !!center &&
        boundariesLoading &&
        <Loader />
        }
        <AddZoneDialog
          addBoundary={newBoundary}
          isOpen={addZoneDialogOpen}
          onConfirm={this.handleAddNew}
          onClose={() => this.setState({ addZoneDialogOpen: false })}
        />
        <EditBoundaryDialog
          isOpen={editBoundaryDialogOpen}
          isSubmitting={boundarySubmitting}
          boundary={editBoundary}
          onClose={() => this.setState({ editBoundaryDialogOpen: false })}
          onConfirm={this.handleSubmitBoundary}
        />
        <AlertDialog
          isOpen={this.state.showDeleteZoneDialog}
          onClose={() => this.setState({ showDeleteZoneDialog: false })}
          title="Delete zone"
          message={boundary && boundary.delivery_zones[deleteZoneIndex] ? `Do you really want to delete ${boundary.delivery_zones[deleteZoneIndex].name} ?` : ''}
          onConfirm={this.handleDeleteZoneConfirm}
          isSubmitting={zoneDeleting}
        />
        <AlertDialog
          isOpen={!!this.state.deleteBoundaryId}
          onClose={() => this.setState({ deleteBoundaryId: null })}
          title="Delete boundary"
          message="Do you really want to delete boundary?"
          onConfirm={this.handleDeleteBoundaryConfirm}
        />
      </DefaultLayout>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(styles)(Boundaries));
