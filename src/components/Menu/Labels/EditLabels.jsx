import React, { Component } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Container,
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
  ListItemIcon,
} from '@material-ui/core';
import { materialClassesType, routerHistoryType, routerMatchType } from 'types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { styles } from './Labels.styled';
import DefaultLayout from '../../Layouts/DefaultLayout';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import ROUTES from 'constants/routes';
import LabelsDeleteDialog from './LabelsDeleteDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import { MENU_ITEMS_PATH, RESTAURANTS_PATH } from 'constants/apiPaths';
import { LabelsService, notifyService } from 'services';
import { ConfirmLeaving, Search } from 'components/common';

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
        .min(2, 'Your input is too short. Minimum length of the name is 2 symbols')
        .max(10, 'Your input is too long. Maximum length of the name is 10 symbols')
        .required('Required'),
      description: Yup.string()
        .min(3, 'Your input is too short. Minimum length of the name is 3 symbols')
        .max(64, 'Your input is too long. Maximum length of the name is 64 symbols'),
    })
);

class EditLabels extends Component {
  state = {
    value: 0,
    checked: [],
    labelName: '',
    labelDescription: '',
    labelsItem: [],
    newLabel: true,
    labelLoading: true,
    isOpenDeleteDialog: false,
    labelToDelete: null,
    deleting: false,
    isItemToDelete: false,
    itemToDelete: null,
    isSeveralItemToDelete: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id || id === 0) {
      this.setState({
        newLabel: false,
      });
      this.getLabel(id);
    } else {
      this.setState({
        labelLoading: false,
      });
    }
  }

  getLabel = async (id) => {
    try {
      const data = await LabelsService.getLabel(this.props.restaurant.id, id);
      this.setState({
        labelName: data.name,
        labelDescription: (data.description === null) ? '' : data.description,
        labelsItem: data.menu_items,
        labelLoading: false,
      });
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };

  handleCancel = () => {
    this.props.history.push(`${ROUTES.MENU_LABELS}`);
  };


  handleSubmitLabel = async (labelData, { setSubmitting }) => {
    const labelItems = this.state.labelsItem.map((item) => `${item.id}`);
    const label = {
      name: labelData.name,
      description: labelData.description,
      menu_items: labelItems,
    };
    try {
      if (this.state.newLabel) {
        await LabelsService.postLabel(this.props.restaurant.id, label);
      } else {
        await LabelsService.putLabel(
          this.props.restaurant.id,
          this.props.match.params.id,
          label,
        );
      }
      notifyService.showSuccess('Label is successfully saved');
      this.handleCancel();
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
      setSubmitting(false);
    }
  };


  handleAddItem = (item) => {
    if (item && this.state.labelsItem.every(x => x.id !== item.id)) {
      const newLabelItems = this.state.labelsItem;
      this.setState({
        labelsItem: [item, ...newLabelItems],
      });
    }
  };

  handleDelete = (lable) => {
    this.setState({
      labelToDelete: lable,
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
      this.handleCancel();
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

  handleDeleteItem = (item) => {
    this.setState({
      isItemToDelete: true,
      itemToDelete: item,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteSeveralItem = (item) => {
    this.setState({
      isItemToDelete: true,
      isSeveralItemToDelete: true,
      itemToDelete: item,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteItemConfirm = async () => {
    const {
      labelsItem,
      itemToDelete,
      checked,
    } = this.state;
    try {
      if (this.state.isSeveralItemToDelete) {
        let items = labelsItem;

        /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
        for (let i = 0; i < checked.length; i++) {
          items = items.filter((item) => item.id !== checked[i]);
        }
        this.setState({
          labelsItem: items,
          itemToDelete: null,
          checked: [],
          isSeveralItemToDelete: false,
          isItemToDelete: false,
        });
        this.handleDeleteClose();
        notifyService.showInfo('Items are successfully deleted');
      } else {
        const updatedItems = labelsItem.filter((item) => item.id !== itemToDelete.id);
        this.setState({
          labelsItem: updatedItems,
          itemToDelete: null,
          checked: [],
          isItemToDelete: false,
        });
        this.handleDeleteClose();
        notifyService.showInfo('Item is successfully deleted');
      }
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  openErrorTab = (values) => {
    const checkMinLengthName = values.name.length < 2;
    const checkMaxLengthName = values.name.length > 32;
    const checkMinLengthDescription = values.description.length > 0 &&
      values.description.length < 3;
    const checkMaxLengthDescription = values.description.length > 64;
    if (
      checkMinLengthName ||
      checkMaxLengthName ||
      checkMinLengthDescription ||
      checkMaxLengthDescription
    ) {
      this.setState({
        value: 0,
      });
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

  render() {
    const {
      value,
      labelLoading,
      newLabel,
      labelToDelete,
      isOpenDeleteDialog,
      deleting,
      labelName,
      labelDescription,
      labelsItem,
      itemToDelete,
      checked,
      isItemToDelete,
    } = this.state;
    const { classes } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={{
          name: labelName,
          description: labelDescription,
        }}
        onSubmit={this.handleSubmitLabel}
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
                    title="Create new label"
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
                          <Tab label="Label info" {...handleChangeId(0)} />
                          <Tab label="Items with this label" {...handleChangeId(1)} />
                        </Tabs>
                      </AppBar>
                      <TabPanel value={value} index={0}>
                        {!labelLoading ? (
                          <div>
                            <Typography variant="h5" className={classes.labelInfoTitle}>
                              Label name and description
                            </Typography>
                            <Typography variant="h6">
                              Label name*
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
                            <Typography variant="h6">
                              Description
                            </Typography>
                            <TextField
                              name="description"
                              error={errors.description && touched.description}
                              value={values.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={(errors.description && touched.description) &&
                              errors.description}
                              margin="normal"
                              fullWidth
                              variant="outlined"
                              multiline
                              rows="4"
                            />
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
                            onChange={(item) => {
                              this.handleAddItem(item);
                            }}
                            optionLabel="name"
                            searchApiUrl={`${RESTAURANTS_PATH}/${this.props.restaurant.id}${MENU_ITEMS_PATH}`}
                          />
                        </Grid>
                        {labelsItem.length === 0 ?
                          <Typography variant="h5" className={classes.labelInfoTitle}>
                            You have no labels
                          </Typography> :
                          <div>
                            {
                              checked.length ?
                                <Grid container>
                                  <Typography component="span">
                                    {`${checked.length} item${checked.length === 1 ? '' : 's'} selected`}
                                    <Button
                                      color="secondary"
                                      onClick={() => { this.handleDeleteSeveralItem({ name: 'items' }); }}
                                    >
                                      Remove the label from items
                                    </Button>
                                  </Typography>
                                </Grid>
                                :
                                <Typography>
                                  {labelsItem.length ? `${labelsItem.length} item${labelsItem.length === 1 ? '' : 's'}` : 'No Items'}
                                </Typography>
                            }
                            <List>
                              {labelsItem.map((item) => (
                                <ListItem key={item.id} className={classes.labelItem}>
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      tabIndex={-1}
                                      disableRipple
                                      onClick={() => {
                                        this.handleToggle(item.id);
                                      }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary={item.name} />
                                  <ListItemSecondaryAction>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        aria-label="delete"
                                        onClick={() => this.handleDeleteItem(item)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              ))}
                            </List>
                          </div>
                        }
                      </TabPanel>
                    </CardContent>
                    <CardActions>
                      <Grid container justify="flex-end">
                        {!newLabel &&
                        <Button
                          color="secondary"
                          variant="contained"
                          className={classes.formButton}
                          type="button"
                          onClick={() => this.handleDelete({
                            name: labelName,
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
                <LabelsDeleteDialog
                  isOpen={isOpenDeleteDialog}
                  handleDeleteClose={this.handleDeleteClose}
                  handleDeleteConfirm={isItemToDelete ?
                    this.handleDeleteItemConfirm :
                    this.handleDeleteConfirm}
                  labelToDelete={isItemToDelete ?
                    itemToDelete :
                    labelToDelete}
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

EditLabels.propTypes = {
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

export default connect(mapStateToProps, null)(withStyles(styles)(EditLabels));

