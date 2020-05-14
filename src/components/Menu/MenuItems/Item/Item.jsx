import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Paper,
} from '@material-ui/core';

import { withStyles } from '@material-ui/styles';
import { listStyles } from './Item.styled';
import DefaultLayout from '../../../Layouts/DefaultLayout/index';
import ItemInfo from './ItemInfo';
import ItemModifiers from './ItemModifiers';
import ItemSchedules from './ItemSchedules';
import ItemLabels from './ItemLabels';
import {
  MenuItemService,
  MenuScheduleService,
  modifiersService,
  LabelsService,
  notifyService,
} from 'services';
import ItemDeleteDialog from '../Items/ItemDeleteDialog';
import ConfirmLeaving from '../../../common/ConfirmLeaving/ConfirmLeaving';
import { routerMatchType, materialClassesType, routerHistoryType } from 'types';
import ROUTES from 'constants/routes';
import { getErrorMessage } from 'sdk/utils';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const validationSchema = () => (
  Yup.object()
    .shape({
      name: Yup.string()
        .min(2, 'Your input is too short. Minimum length of the name is 2 symbols')
        .max(64, 'Your input is too long. Maximum length of the name is 64 symbols')
        .required('Required'),
      description: Yup.string()
        .min(3, 'Your input is too short. Minimum length of the address is 3 symbols')
        .max(256, 'Your input is too long. Maximum length of the address is 256 symbols'),
      price: Yup.number()
        .typeError('Only digits and . symbol are allowed.')
        .min(1, 'The value should be between 1 and 500 in format xx.xx.')
        .max(500, 'The value should be between 1 and 500 in format xx.xx.')
        .required('Required'),
      menu_section: Yup.string()
        .typeError('Required')
        .required('Required'),
    })
);

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

class Item extends Component {
  state = {
    value: 0,
    newItem: false,
    itemLoading: true,
    item: {
      name: '',
      description: '',
      availability_status: 'AVAILABLE',
      image: '',
      menu_labels: [],
      menu_schedules: [],
      menu_modifiers: [],
      not_available_for_days: 1,
      position_order: null,
      menu_section: this.props.menuItems.id || '',
      section_modifiers: [],
      section_schedules: [],
      price: '',
    },
    isOpenDeleteDialog: false,
    deleting: false,
    sections: [],
    sectionLoading: true,
    schedules: [],
    modifiers: [],
    labels: [],
  };

  componentDidMount() {
    const {
      sectionId,
      itemId,
    } = this.props.match.params;

    if (itemId || itemId === 0) {
      this.setState({
        newItem: false,
      });
      this.getItemToEdit(sectionId, itemId);
    } else {
      this.setState({
        itemLoading: false,
        newItem: true,
      });
      this.getSectionsData();
      this.getSchedulesData();
      this.getModifiersData();
      this.getLabelsData();
    }
  }

  getSectionsData = async () => {
    const {
      restaurant,
    } = this.props;

    try {
      const newSections = await MenuItemService.getSections(restaurant.id);
      this.setState((prevState) => ({
        sections: newSections.result,
        sectionLoading: false,
        item: {
          ...prevState.item,
        },
      }));
    } catch (error) {
      this.setState({
        sectionLoading: false,
      });
      notifyService.showError(getErrorMessage(error));
    }
  };

  getSchedulesData = async () => {
    try {
      const newSchedules = await MenuScheduleService.getSchedules(this.props.restaurant.id);
      this.setState({
        schedules: newSchedules.result,
      });
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
    }
  };

  getLabelsData = async () => {
    try {
      const newLabels = await LabelsService.getLabelsList(this.props.restaurant.id);
      this.setState({
        labels: newLabels.result,
      });
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
    }
  };

  getModifiersData = async () => {
    try {
      const newModifiers = await modifiersService.getModifiersList(this.props.restaurant.id);
      this.setState({
        modifiers: newModifiers.result,
      });
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
    }
  };

  getItemToEdit = async (sectionId, itemId) => {
    try {
      const itemToEdit = await MenuItemService.getItemToEdit(
        this.props.restaurant.id,
        sectionId,
        itemId,
      );
      const sections = await MenuItemService.getSections(this.props.restaurant.id);
      const schedules = await MenuScheduleService.getSchedules(this.props.restaurant.id);
      const modifiers = await modifiersService.getModifiersList(this.props.restaurant.id);
      const labels = await LabelsService.getLabelsList(this.props.restaurant.id);
      this.setState({
        item: {
          id: itemToEdit.id,
          name: itemToEdit.name,
          description: (itemToEdit.description === null) ? '' : itemToEdit.description,
          availability_status: itemToEdit.availability_status,
          image: itemToEdit.image,
          menu_labels: itemToEdit.menu_labels,
          menu_schedules: itemToEdit.menu_schedules,
          menu_modifiers: itemToEdit.menu_modifiers,
          not_available_for_days: itemToEdit.not_available_for_days,
          position_order: itemToEdit.position_order,
          menu_section: this.props.match.params.sectionId,
          price: itemToEdit.price,
          section_modifiers: itemToEdit.menu_section ? itemToEdit.menu_section.menu_modifiers : [],
          section_schedules: itemToEdit.menu_section ? itemToEdit.menu_section.menu_schedules : [],
        },
        sections: sections.result,
        schedules: schedules.result,
        labels: labels.result,
        modifiers: modifiers.result,
        itemLoading: false,
        sectionLoading: false,
      });
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
    }
  };

  handleSubmitEditItem = async (itemData, { setSubmitting }) => {
    const {
      itemId,
    } = this.props.match.params;
    try {
      const newItem = {
        name: itemData.name,
        description: itemData.description,
        availability_status: itemData.availability_status,
        image: itemData.image,
        menu_labels: itemData.menu_labels.map((label) => `${label.id}`),
        menu_schedules: itemData.menu_schedules.map((schedule) => `${schedule.id}`),
        menu_modifiers: itemData.menu_modifiers.map((modifier, id) => ({
          modifier: modifier.id,
          modifier_position: id + 1,
        })),
        not_available_for_days: itemData.not_available_for_days,
        position_order: itemData.position_order,
        menu_section: itemData.menu_section,
        price: itemData.price,
      };
      await MenuItemService.putItem(
        this.props.restaurant.id,
        itemId,
        newItem,
      );
      notifyService.showSuccess('Item is successfully saved');
      this.props.history.push(ROUTES.MENU_ITEMS);
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  handleSubmitAddItem = async (itemData, { setSubmitting }) => {
    const newItem = {
      name: itemData.name,
      description: itemData.description,
      availability_status: itemData.availability_status,
      image: itemData.image,
      menu_labels: itemData.menu_labels.map((label) => `${label.id}`),
      menu_schedules: itemData.menu_schedules.map((schedule) => `${schedule.id}`),
      menu_modifiers: itemData.menu_modifiers.map((modifier, index) => ({
        modifier: modifier.id,
        modifier_position: index + 1,
      })),
      not_available_for_days: itemData.not_available_for_days,
      position_order: itemData.position_order,
      menu_section: itemData.menu_section,
      price: itemData.price,
    };

    try {
      await MenuItemService.postItem(this.props.restaurant.id, newItem);
      notifyService.showSuccess('Item is successfully saved');
      this.props.history.push(ROUTES.MENU_ITEMS);
    } catch (error) {
      notifyService.showError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };

  handleDelete = () => {
    this.setState({
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    const {
      sectionId,
      itemId,
    } = this.props.match.params;

    try {
      await MenuItemService.deleteItem(this.props.restaurant.id, sectionId, itemId);
      notifyService.showInfo('Item is successfully deleted');
      this.setState({
        deleting: false,
        isOpenDeleteDialog: false,
      });
      this.props.history.push(ROUTES.MENU_ITEMS);
    } catch (error) {
      this.setState({ deleting: false });
      notifyService.showError(getErrorMessage(error));
    }
  };

  handleCancel = () => {
    this.props.history.push(ROUTES.MENU_ITEMS);
  };

  openErrorTab = (errors) => {
    if (errors.name || errors.description || errors.price || errors.menu_section) {
      this.setState({
        value: 0,
      });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      value,
      item,
      itemLoading,
      sections,
      modifiers,
      labels,
      schedules,
      newItem,
      isOpenDeleteDialog,
      deleting,
    } = this.state;

    return (
      <DefaultLayout>
        <Formik
          enableReinitialize
          initialValues={{
            ...item,
            sections,
            modifiers,
            labels,
            schedules,
          }}
          onSubmit={newItem ? this.handleSubmitAddItem : this.handleSubmitEditItem}
          validationSchema={validationSchema()}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              dirty,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <Container>
                  <Paper square>
                    <Tabs
                      value={value}
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleChange}
                      aria-label="simple tabs example"
                      variant="fullWidth"
                    >
                      <Tab label="Item Info and Modifiers" {...a11yProps(0)} />
                      <Tab label="Schedules and Labels" {...a11yProps(1)} />
                    </Tabs>
                  </Paper>
                  <TabPanel value={value} index={0}>
                    {itemLoading ? (
                      <Grid container direction="row" justify="center" alignItems="center">
                        <CircularProgress />
                      </Grid>
                      ) :
                      <div>
                        <ItemInfo
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          touched={touched}
                          errors={errors}
                          sectionLoading={this.state.sectionLoading}
                        />
                        <ItemModifiers
                          values={values}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                        />
                      </div>
                    }
                    <ItemDeleteDialog
                      isOpen={isOpenDeleteDialog}
                      handleDeleteClose={this.handleDeleteClose}
                      handleDeleteConfirm={this.handleDeleteConfirm}
                      itemToDelete={item}
                      deleting={deleting}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <ItemSchedules
                      values={values}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                    />
                    <ItemLabels
                      values={values}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                    />
                  </TabPanel>
                  <div>
                    {
                      !newItem
                      &&
                      <Button
                        size="large"
                        className={classes.formButton}
                        disabled={isSubmitting}
                        variant="contained"
                        color="secondary"
                        onClick={this.handleDelete}
                      >
                        Delete
                      </Button>
                    }
                    {
                      <Button
                        size="large"
                        className={classes.formButton}
                        disabled={isSubmitting}
                        variant="contained"
                        onClick={this.handleCancel}
                      >
                        Cancel
                      </Button>
                    }
                    {
                      <Button
                        type="submit"
                        size="large"
                        className={classes.formButton}
                        disabled={isSubmitting}
                        variant="contained"
                        color="primary"
                        onClick={() => this.openErrorTab(errors)}
                      >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                      </Button>
                    }
                    {
                      <ConfirmLeaving active={dirty && !isSubmitting} />
                    }
                  </div>
                </Container>
              </form>);
          }}
        </Formik>
      </DefaultLayout>
    );
  }
}

Item.propTypes = {
  classes: materialClassesType.isRequired,
  menuItems: PropTypes.shape({
    name: PropTypes.string,
    menu_items_count: PropTypes.number,
    id: PropTypes.number,
  }).isRequired,
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  history: routerHistoryType.isRequired,
  match: routerMatchType.isRequired,
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
  menuItems: state.menuItems,
});

export default connect(mapStateToProps)(withStyles(listStyles)(Item));
