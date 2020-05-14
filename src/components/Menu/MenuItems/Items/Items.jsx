import React, { Component } from 'react';
import { connect } from 'react-redux';
import { materialClassesType, routerHistoryType } from 'types';
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Select,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { listStyles, useStyles } from './Items.styled';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import ItemDeleteDialog from './ItemDeleteDialog';
import { MenuItemService, notifyService as notifier } from 'services';
import { setSelectedSection } from '../../../../actions/menuItemsActions';
import { withRouter } from 'react-router-dom';
import ItemUpdateDialog from './ItemUpdateDialog';
import PropTypes from 'prop-types';
import ROUTES from 'constants/routes';
import { Search, FileUpload } from 'components/common';
import { RESTAURANTS_PATH, MENU_ITEMS_PATH } from 'constants/apiPaths';
import AddIcon from '@material-ui/icons/Add';
import { convertToPrice } from 'sdk/utils';

function ChipAvailabilityStatus(props) {
  const availabilityStatus = props.availabilityStatus.availability_status;
  const availableForDays = props.availabilityStatus.not_available_for_days;
  const classes = useStyles();

  if (availabilityStatus === 'SOLD_OUT' && availableForDays === 0) {
    return (<Chip
      label="Sold out for today"
      className={classes.soldOut}
    />);
  }
  if (availabilityStatus === 'SOLD_OUT' && availableForDays !== 0) {
    return (<Chip
      label={`Sold out for ${availableForDays} days`}
      className={classes.soldOut}
    />);
  }
  if (availabilityStatus === 'ARCHIVED') {
    return (<Chip
      label="Archived"
      className={classes.archived}
    />);
  }
  return (<Chip
    label="Available"
    className={classes.available}
  />);
}

const DragHandle = SortableHandle(({ iconClassName }) => (
  <ListItemIcon className={iconClassName}>
    <DragHandleIcon />
  </ListItemIcon>
));

const SortableItem = SortableElement(({
  item, sectionId, handleToggle, handleDelete, handleEdit,
}) => {
  const classes = useStyles();
  return (
    <ListItem
      key={item.id}
      className={classes.sectionItem}
      onClick={() => {
        handleToggle(item.id);
      }}
      ContainerComponent="div"
    >
      <DragHandle iconClassName={classes.listIcon} />
      <ListItemIcon className={classes.listIcon}>
        <Checkbox
          edge="start"
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemIcon className={classes.listIcon}>
        <ListItemAvatar>
          <Avatar
            alt={item.name}
            src={item.image}
          />
        </ListItemAvatar>
      </ListItemIcon>
      <Grid container justify="space-between" className={classes.itemText}>
        <Typography className={classes.itemName}>
          {item.name}
        </Typography>
        <Grid item style={{ display: 'flex' }}>
          <ChipAvailabilityStatus
            availabilityStatus={item}
          />
          <ListItemText className={classes.itemPrice}>
            <div className={classes.itemPrice}>
              <span>$</span>
              <span>{convertToPrice(item.price)}</span>
            </div>
          </ListItemText>
        </Grid>
      </Grid>
      <ListItemSecondaryAction>
        <Tooltip title="Edit" onClick={() => handleEdit(sectionId, item.id)}>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" onClick={() => handleDelete(item)}>
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
});

const SortableList = SortableContainer(({
  items, sectionId, handleToggle, handleDelete, handleEdit,
}) => {
  const classes = useStyles();
  return (
    <List
      className={classes.sectionList}
      component="div"
    >
      {items.map((item, index) => (
        <SortableItem
          key={`item-${item.name}`}
          index={index}
          item={item}
          sectionId={sectionId}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ))}
    </List>
  );
});

class Items extends Component {
  state = {
    checked: [],
    option: 'Options',
    isOpenDeleteDialog: false,
    itemToDelete: null,
    deleting: false,
    isOpenUpdateDialog: false,
    isDeleteSeveralItems: false,
    items: [],
    itemLoading: false,
  };

  componentDidMount() {
    if (this.props.menuItems.id) {
      this.getItemsData();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.menuItems.id !== prevProps.menuItems.id) {
      this.getItemsData();
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));

    if (oldIndex !== newIndex) {
      this.handleReorder(oldIndex, newIndex);
    }
  };

  getItemsData = async () => {
    const {
      restaurant,
      menuItems,
    } = this.props;
    this.setState({
      itemLoading: true,
    });
    try {
      const newSections = await MenuItemService.getSections(restaurant.id);
      if (menuItems.id !== null) {
        const newItems = await MenuItemService.getItems(restaurant.id, menuItems.id);
        this.setState({
          items: newItems,
          itemLoading: false,
        });
        this.props.setSelectedSection({
          ...this.props.menuItems,
          sections: newSections.result,
        });
      } else {
        this.setState({
          items: [],
          itemLoading: false,
        });
      }
    } catch (error) {
      const { response } = error;
      this.setState({ itemLoading: false });
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleReorder = async (oldIndex, newItemId) => {
    const newItemData = {
      new_position: newItemId + 1,
    };
    try {
      await MenuItemService.postArrangeItems(
        this.props.restaurant.id,
        this.props.menuItems.id,
        this.state.items[newItemId].id,
        newItemData,
      );
      notifier.showSuccess('Order is successfully saved');
    } catch (error) {
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
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

  handleChange = (event) => {
    this.setState({
      option: event.target.value,
    });
  };

  handleDelete = (item) => {
    this.setState({
      itemToDelete: item,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteSeveralItems = (items) => {
    this.setState({
      itemToDelete: items,
      isDeleteSeveralItems: true,
      isOpenDeleteDialog: true,
    });
  };

  handleUpdate = () => {
    this.setState({ isOpenUpdateDialog: true });
  };

  handleSearch = (item) => {
    if (item) {
      this.props.history.push(`/section/${item.menu_section.id}${ROUTES.ITEM}/${item.id}/edit`);
    }
  };

  handleEdit = (sectionId = '', itemId = '') => {
    this.props.history.push(`/section/${sectionId}${ROUTES.ITEM}/${itemId}/edit`);
  };

  handleAdd = () => {
    this.props.history.push(`${ROUTES.ITEM}/add`);
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  handleClose = () => {
    this.setState({
      isOpenUpdateDialog: false,
    });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      await MenuItemService.deleteItem(
        this.props.restaurant.id,
        this.props.menuItems.id,
        this.state.itemToDelete.id,
      );
      notifier.showInfo('Item is successfully deleted');
      this.setState({
        deleting: false,
        itemToDelete: null,
        isOpenDeleteDialog: false,
      });
      this.props.setSelectedSection({
        ...this.props.menuItems,
        name: this.props.menuItems.name,
        menu_items_count: Number(this.props.menuItems.menu_items_count) - 1,
        id: Number(this.props.menuItems.id),
      });
      this.getItemsData();
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleDeleteSeveralItemsConfirm = async () => {
    const checkedItems = this.state.checked.map((id) => `id[]=${id}&`);
    const checkedId = checkedItems.join('');
    try {
      await MenuItemService.deleteSeveralItems(
        this.props.restaurant.id,
        this.props.menuItems.id,
        checkedId,
      );
      this.setState({ isOpenDeleteDialog: false });
      notifier.showInfo('Items are successfully deleted');
      this.props.setSelectedSection({
        ...this.props.menuItems,
        name: this.props.menuItems.name,
        menu_items_count: Number(this.props.menuItems.menu_items_count) - checkedItems.length,
        id: Number(this.props.menuItems.id),
      });
      this.setState({
        checked: [],
        option: 'Options',
      });
      this.getItemsData();
    } catch (error) {
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleUpdateSeveralItems = async (availabilityStatus) => {
    const checkedItems = this.state.checked.map((id) => `id[]=${id}&`);
    const checkedId = checkedItems.join('');
    try {
      await MenuItemService.updateSeveralItems(
        this.props.restaurant.id,
        this.props.menuItems.id,
        checkedId,
        {
          availability_status: availabilityStatus.availability_status,
          not_available_for_days: 0,
        },
      );
      this.handleClose();
      notifier.showInfo('Items are successfully updated');
      this.setState({
        checked: [],
        option: 'Options',
      });
      this.getItemsData();
    } catch (error) {
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  render() {
    const { classes } = this.props;
    const { option, checked, isDeleteSeveralItems } = this.state;
    return (
      <Grid item className={classes.root}>
        <List
          component="nav"
          className={classes.sectionList}
        >
          <ListItem
            className={classes.sectionsSubheader}
          >
            <ListItemText
              primary={
                this.props.menuItems.name ?
                  <div>
                    <Typography variant="h6">
                      {this.props.menuItems.name}
                    </Typography>
                    <Typography component="span">
                      {
                        !this.state.itemLoading &&
                        `${this.state.items.length} items`
                      }
                    </Typography>
                  </div>
                  :
                  <Typography variant="h6">Section</Typography>
              }
            />
            <Grid className={classes.search}>
              <Search
                label="Find item"
                placeholder="Start typing..."
                onChange={value => this.handleSearch(value)}
                optionLabel="name"
                searchApiUrl={`${RESTAURANTS_PATH}/${this.props.restaurant.id}${MENU_ITEMS_PATH}`}
              />
            </Grid>
          </ListItem>
          <ListItem className={classes.sectionActions}>
            <Grid container justify="space-between">
              <Grid item>
                <FormControl variant="outlined" className={classes.formControl}>
                  <Select
                    native
                    margin="dense"
                    value={this.state.option}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'option',
                    }}
                  >
                    <option>Options</option>
                    <option>Delete selected items</option>
                    <option>Update availability</option>
                  </Select>
                </FormControl>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={option === 'Options' || checked.length === 0}
                  className={classes.applyItemButton}
                  onClick={option === 'Delete selected items' ? () => (this.handleDeleteSeveralItems({ name: 'items' })) : this.handleUpdate}
                >
                  Apply
                </Button>
              </Grid>
              <Grid item>
                <FileUpload
                  label="Upload file"
                  disabled={!this.props.menuItems.id}
                  onComplete={() => this.getItemsData()}
                />
                <Button
                  startIcon={<AddIcon />}
                  color="primary"
                  variant="contained"
                  className={classes.addSectionButton}
                  onClick={this.handleAdd}
                  disabled={!this.props.menuItems.id}
                >
                  Add item
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        </List>
        {this.state.itemLoading ?
          <Grid container direction="row" justify="center" alignItems="center">
            <CircularProgress />
          </Grid>
          :
          <SortableList
            items={this.state.items}
            onSortEnd={this.onSortEnd}
            useDragHandle
            handleToggle={this.handleToggle}
            handleDelete={this.handleDelete}
            handleEdit={this.handleEdit}
            sectionId={this.props.menuItems.id}
          />
        }
        <ItemDeleteDialog
          isOpen={this.state.isOpenDeleteDialog}
          handleDeleteClose={this.handleDeleteClose}
          handleDeleteConfirm={
            isDeleteSeveralItems ?
              this.handleDeleteSeveralItemsConfirm :
              this.handleDeleteConfirm
          }
          itemToDelete={this.state.itemToDelete}
          deleting={this.state.deleting}
        />
        <ItemUpdateDialog
          isOpen={this.state.isOpenUpdateDialog}
          submitHandler={this.handleUpdateSeveralItems}
          closeHandler={this.handleClose}
        />
      </Grid>
    );
  }
}

Items.propTypes = {
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
  menuItems: PropTypes.shape({
    name: PropTypes.string,
    menu_items_count: PropTypes.number,
    id: PropTypes.number,
  }).isRequired,
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  setSelectedSection: PropTypes.func.isRequired,
};

ChipAvailabilityStatus.propTypes = {
  availabilityStatus: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
  menuItems: state.menuItems,
});

const mapDispatchToProps = dispatch => ({
  setSelectedSection: section => dispatch(setSelectedSection(section)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(listStyles)(withRouter(Items)));
