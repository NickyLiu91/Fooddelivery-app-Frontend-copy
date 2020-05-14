import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { listStyles, useStyles } from './Item.styled';
import { materialClassesType, routerHistoryType } from 'types';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import DragHandleIcon from '@material-ui/icons/DragHandle';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import ROUTES from 'constants/routes';
import { withRouter } from 'react-router-dom';
import { notifyService as notifier, MenuItemService } from 'services';
import ItemDeleteDialog from '../Items/ItemDeleteDialog';
import { getErrorMessage } from 'sdk/utils';

const DragHandle = SortableHandle(() => (
  <ListItemIcon>
    <DragHandleIcon />
  </ListItemIcon>
));

const ModifierText = ({ item }) => {
  const classes = useStyles();

  return (
    <ListItemText primary={
      <div>
        <Typography className={classes.modifierName} variant="h6">
          {item.title} { !!item.internal_name &&
      `[${item.internal_name}]`
      }
        </Typography>
        <Typography>
          <Box className={classes.optionsAmount} component="span">
            {`${item.items.length ? item.items.length : 'No'} option${item.items.length === 1 ? '' : 's'}`}
          </Box>
          { !!item.items.length &&
      `(${item.items.map(option => option.title).join(', ')})`
      }
        </Typography>
      </div>
    }
    />
  );
};


ModifierText.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
};

const SortableItem = SortableElement(({ item, handleEditModifier, handleDelete }) => {
  const classes = useStyles();
  return (
    <ListItem
      key={item.id}
      className={classes.itemModifier}
    >
      <DragHandle />
      <ModifierText item={item} classes={classes} />
      <Tooltip
        title="Edit"
        onClick={() => {
          handleEditModifier(item.id);
        }}
      >
        <IconButton aria-label="edit">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Delete"
        onClick={() => {
          handleDelete({ name: item.title, id: item.id });
        }}
      >
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
});

const SortableList = SortableContainer(({ modifiers, handleEditModifier, handleDelete }) => (
  <List>
    {modifiers.map((item, index) => (
      <SortableItem
        key={`item-${item.id}`}
        index={index}
        item={item}
        handleEditModifier={handleEditModifier}
        handleDelete={handleDelete}
      />
    ))}
  </List>
));

class ItemModifiers extends Component {
  state = {
    selectedModifier: 'null',
    isOpenDeleteDialog: false,
    itemToDelete: null,
    deleting: false,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const selectedModifier = this.props.values.menu_modifiers[oldIndex];
    this.props.setFieldValue('menu_modifiers', arrayMove(this.props.values.menu_modifiers, oldIndex, newIndex));

    if (oldIndex !== newIndex) {
      this.handleReorder(selectedModifier.id, newIndex);
    }
  };

  handleChange = (event) => {
    this.setState({
      selectedModifier: event.target.value,
    });
  };

  handleAddModifier = async () => {
    const {
      values,
      setFieldValue,
      restaurant,
    } = this.props;
    const { selectedModifier } = this.state;
    const selectedItem = values.modifiers.find((item) => item.id === Number(selectedModifier));
    const newModifiers = [...values.menu_modifiers];
    try {
      if (this.props.values.id) {
        await MenuItemService.addModifier(
          restaurant.id,
          values.id,
          selectedModifier,
          { new_position: newModifiers.length + 1 },
        );
      }
      newModifiers.push(selectedItem);
      setFieldValue('menu_modifiers', newModifiers);
      notifier.showInfo('Item is successfully saved');
    } catch (error) {
      notifier.showError(getErrorMessage(error));
    }
  };

  handleEditModifier = (id) => {
    this.props.history.push(`${ROUTES.MODIFIERS}/${id}/edit`);
  };

  handleDelete = (item) => {
    this.setState({
      itemToDelete: item,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    const {
      restaurant,
      values,
      setFieldValue,
    } = this.props;
    const {
      itemToDelete,
    } = this.state;
    try {
      if (values.id) {
        await MenuItemService.deleteModifier(restaurant.id, values.id, itemToDelete.id);
      }
      const updatedItems =
        values.menu_modifiers.filter((item) => item.id !== itemToDelete.id);
      setFieldValue('menu_modifiers', updatedItems);
      notifier.showInfo('Item is successfully deleted');
      this.setState({
        deleting: false,
        itemToDelete: null,
        isOpenDeleteDialog: false,
      });
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

  handleReorder = async (modifierId, position) => {
    const newModifierData = {
      new_position: position + 1,
    };
    try {
      if (this.props.values.id) {
        await MenuItemService.reorderModifier(
          this.props.restaurant.id,
          this.props.values.id,
          modifierId,
          newModifierData,
        );
      }
      notifier.showSuccess('Order is successfully saved');
    } catch (error) {
      notifier.showError(getErrorMessage(error));
    }
  };

  render() {
    const {
      classes,
      values,
    } = this.props;

    const {
      selectedModifier,
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
                Modifiers
              </Typography>
              <FormControl variant="outlined" className={classes.selectModifiers}>
                <Select
                  margin="dense"
                  native
                  name="modifier"
                  value={selectedModifier}
                  onChange={this.handleChange}
                >
                  <option value="null" label="Select Modifier" />
                  {values.modifiers.map(modifier => (
                    <option
                      value={modifier.id}
                      label={`${modifier.title} ${modifier.internal_name ? `[${modifier.internal_name}]` : ''}`}
                      key={modifier.id}
                    />
                  ))}
                </Select>
              </FormControl>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={this.handleAddModifier}
                disabled={this.state.selectedModifier === 'null' || this.props.values.menu_modifiers.some(elem => elem.id === Number(this.state.selectedModifier))}
              >
                Add Modifier
              </Button>
              <SortableList
                modifiers={this.props.values.menu_modifiers}
                onSortEnd={this.onSortEnd}
                useDragHandle
                handleEditModifier={this.handleEditModifier}
                handleDelete={this.handleDelete}
              />
              {
                values.section_modifiers &&
                !!values.section_modifiers.length &&
                <>
                  <Typography variant="h6">
                    Section modifiers:
                  </Typography>
                  <List>
                    {values.section_modifiers.map((item) => (
                      <ListItem key={item.id} className={classes.itemSchedule}>
                        <ModifierText item={item} />
                      </ListItem>
                    ))}
                  </List>
                </>
              }
            </CardContent>
            <ItemDeleteDialog
              isOpen={isOpenDeleteDialog}
              handleDeleteClose={this.handleDeleteClose}
              handleDeleteConfirm={this.handleDeleteConfirm}
              itemToDelete={itemToDelete}
              deleting={deleting}
            />
          </Card>
        </Grid>
      </Grid>
    );
  }
}

ItemModifiers.propTypes = {
  classes: materialClassesType.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  history: routerHistoryType.isRequired,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});

export default connect(mapStateToProps, null)(withStyles(listStyles)(withRouter(ItemModifiers)));
