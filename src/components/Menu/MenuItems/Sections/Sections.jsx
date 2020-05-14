import React, { Component } from 'react';
import { connect } from 'react-redux';
import { materialClassesType } from 'types';
import {
  Badge,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { listStyles, useStyles } from './Sections.styled';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { setSelectedSection } from '../../../../actions/menuItemsActions';
import SectionDeleteDialog from './SectionDeleteDialog';
import SectionDialog from './SectionDialog';
import { MenuItemService, notifyService as notifier, notifyService } from 'services';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import { getErrorMessage } from 'sdk/utils';

const DragHandle = SortableHandle(() => {
  const classes = useStyles();
  return (
    <ListItemIcon className={classes.dragHandle}>
      <DragHandleIcon />
    </ListItemIcon>
  );
});

const SortableItem = SortableElement(({
  section, selectedIndex, handleListItemClick, handleDelete, handleEdit,
}) => {
  const classes = useStyles();
  return (
    <ListItem
      selected={selectedIndex === section.id}
      onClick={(event) => {
        handleListItemClick(event, section);
      }}
      button
      className={classes.sectionItem}
      ContainerComponent="div"
    >
      <DragHandle />
      <ListItemText
        primary={(
          <span className={classes.sectionName}>
            {section.name}
          </span>
        )}
        className={classes.sectionText}
      />
      <ListItemSecondaryAction>
        <Tooltip title="Edit" onClick={() => handleEdit(section)}>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" onClick={() => handleDelete(section)}>
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {
          <Badge
            color="primary"
            badgeContent={section.menu_items_count}
            showZero
            className={classes.sectionsBadge}
          />
        }
      </ListItemSecondaryAction>
    </ListItem>
  );
});

const SortableList = SortableContainer(({
  section, selectedIndex, handleListItemClick, handleDelete, handleEdit, menuItems,
}) => {
  const classes = useStyles();
  return (
    <List
      className={classes.sectionList}
      component="div"
    >
      {section.map((item, index) => (
        <SortableItem
          key={`item-${item.name}`}
          index={index}
          section={item}
          selectedIndex={selectedIndex}
          handleListItemClick={handleListItemClick}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          className={classes.sectionItem}
          menuItems={menuItems}
        />
      ))}
    </List>
  );
});

class Sections extends Component {
  state = {
    selectedIndex: null,
    isOpenDeleteDialog: false,
    sectionToDelete: null,
    deleting: false,
    isOpenAddSectionDialog: false,
    isOpenEditSectionDialog: false,
    sections: this.props.menuItems.sections,
    sectionToEdit: {
      name: '',
      description: '',
    },
    sectionLoading: false,
  };

  componentDidMount() {
    this.getSectionsData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.menuItems.sections !== prevProps.menuItems.sections) {
      this.changeSectionState();
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const selectedSectionId = this.state.sections[oldIndex].id;

    this.setState(({ sections }) => ({
      sections: arrayMove(sections, oldIndex, newIndex),
    }));

    if (oldIndex !== newIndex) {
      this.handleReorder(selectedSectionId, newIndex);
    }
  };

  getSectionsData = async () => {
    const {
      restaurant,
    } = this.props;

    this.setState({
      sectionLoading: true,
    });
    try {
      const newSections = await MenuItemService.getSections(restaurant.id);
      this.props.setSelectedSection({
        ...this.props.menuItems,
        name: newSections.result[0].name,
        menu_items_count: Number(newSections.result[0].menu_items_count),
        id: Number(newSections.result[0].id),
        sections: newSections.result,
      });
      this.setState({
        sections: this.props.menuItems.sections,
        selectedIndex: newSections.result[0].id,
        sectionLoading: false,
      });
    } catch (error) {
      this.setState({ sectionLoading: false });
    }
  };

  changeSectionState = () => {
    this.setState(() => ({
      sections: this.props.menuItems.sections,
    }));
  };

  handleDelete = (section) => {
    this.setState({
      sectionToDelete: section,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  handleEdit = (section) => {
    this.setState({
      sectionToEdit: section,
      isOpenEditSectionDialog: true,
    });
  };

  handleOpen = () => {
    this.setState({ isOpenAddSectionDialog: true });
  };

  handleClose = () => {
    this.setState({
      isOpenEditSectionDialog: false,
      isOpenAddSectionDialog: false,
    });
  };

  handleListItemClick = (event, section) => {
    this.setState({
      selectedIndex: section.id,
    });

    this.props.setSelectedSection({
      ...this.props.menuItems,
      id: Number(section.id),
      name: section.name,
      menu_items_count: Number(section.menu_items_count),
    });
  };

  handleDeleteConfirm = async () => {
    this.setState({ deleting: true });
    try {
      await MenuItemService.deleteSection(this.props.restaurant.id, this.state.sectionToDelete.id);
      notifier.showInfo('Section is successfully deleted');
      this.setState({
        deleting: false,
        sectionToDelete: null,
        isOpenDeleteDialog: false,
      });
      this.props.setSelectedSection({
        name: '',
        menu_items_count: 0,
        items: [],
        id: null,
        sections: [],
      });
      this.getSectionsData();
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleSubmitAdd = async (sectionData, { setSubmitting, resetForm, setErrors }) => {
    const newSection = {
      name: sectionData.name,
      description: sectionData.description,
      menu_schedules: sectionData.menu_schedules ?
        sectionData.menu_schedules.map(schedule => schedule.id) :
        [],
      menu_modifiers: sectionData.menu_modifiers ?
        sectionData.menu_modifiers.map(modifier => modifier.id) :
        [],
    };
    try {
      await MenuItemService.postSection(this.props.restaurant.id, newSection);
      notifier.showSuccess('Section is successfully added');
      this.getSectionsData();
      this.handleClose();
      setSubmitting(false);
      resetForm({
        name: '',
        description: '',
      });
    } catch (error) {
      const message = getErrorMessage(error);
      if (message === 'The `name` value is not unique.') {
        setErrors({ name: 'The value is not unique' });
      } else {
        notifyService.showError(message);
      }
      setSubmitting(false);
    }
  };

  handleSubmitEdit = async (sectionData, { setSubmitting }) => {
    const newSection = {
      name: sectionData.name,
      description: sectionData.description,
      menu_schedules: sectionData.menu_schedules ?
        sectionData.menu_schedules.map(schedule => schedule.id) :
        [],
      menu_modifiers: sectionData.menu_modifiers ?
        sectionData.menu_modifiers.map(modifier => modifier.id) :
        [],
    };
    try {
      await MenuItemService.putSection(
        this.props.restaurant.id,
        this.state.sectionToEdit.id,
        newSection,
      );
      notifier.showSuccess('Section is successfully saved');
      this.getSectionsData();
      this.handleClose();
      setSubmitting(false);
    } catch (error) {
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
      setSubmitting(false);
    }
  };

  handleReorder = async (selectedSectionId, newSectionId) => {
    const newSectionData = {
      new_position: newSectionId + 1,
    };
    try {
      await MenuItemService.postArrangeSections(
        this.props.restaurant.id,
        selectedSectionId,
        newSectionData,
      );
      notifier.showSuccess('Order is successfully saved');
    } catch (error) {
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  render() {
    const { classes } = this.props;
    const {
      sections,
      sectionToEdit,
      sectionLoading,
      selectedIndex,
      isOpenDeleteDialog,
      sectionToDelete,
      deleting,
      isOpenAddSectionDialog,
      isOpenEditSectionDialog,
    } = this.state;

    return (
      <Grid className={classes.root} item>
        <List
          component="nav"
          className={classes.sectionHeader}
        >
          <ListItem className={classes.sectionsSubheader}>
            <ListItemText
              primary={
                <Typography variant="h6">Sections</Typography>
              }
            />
            <Badge
              color="secondary"
              badgeContent={sections.length}
              showZero
              className={classes.sectionsBadge}
            />
          </ListItem>
          <ListItem className={classes.setionsActions}>
            <Button
              startIcon={<AddIcon />}
              color="primary"
              variant="contained"
              className={classes.addSectionButton}
              onClick={this.handleOpen}
            >
              Add new section
            </Button>
          </ListItem>
        </List>
        {sectionLoading ? (
          <Grid container direction="row" justify="center" alignItems="center">
            <CircularProgress />
          </Grid>
          ) :
          <SortableList
            section={sections}
            onSortEnd={this.onSortEnd}
            useDragHandle
            selectedIndex={selectedIndex}
            handleListItemClick={this.handleListItemClick}
            handleDelete={this.handleDelete}
            handleEdit={this.handleEdit}
            menuItems={this.props.menuItems}
          />
        }
        <SectionDeleteDialog
          isOpen={isOpenDeleteDialog}
          handleDeleteClose={this.handleDeleteClose}
          handleDeleteConfirm={this.handleDeleteConfirm}
          sectionToDelete={sectionToDelete}
          deleting={deleting}
        />
        <SectionDialog
          defaultData={isOpenAddSectionDialog ? {
            name: '',
            description: '',
          } : sectionToEdit}
          submitHandler={
            isOpenAddSectionDialog ?
              this.handleSubmitAdd :
              this.handleSubmitEdit
          }
          isOpen={
            isOpenAddSectionDialog || isOpenEditSectionDialog
          }
          closeHandler={this.handleClose}
          openHandler={this.handleOpen}
        />
      </Grid>
    );
  }
}

Sections.propTypes = {
  classes: materialClassesType.isRequired,
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  setSelectedSection: PropTypes.func.isRequired,
  menuItems: PropTypes.shape({
    name: PropTypes.string,
    menu_items_count: PropTypes.number,
    id: PropTypes.number,
    sections: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
  menuItems: state.menuItems,
});

const mapDispatchToProps = dispatch => ({
  setSelectedSection: section => dispatch(setSelectedSection(section)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(listStyles)(Sections));
