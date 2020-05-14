import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Box, Container, Paper, Tab, Tabs, Typography, withStyles } from '@material-ui/core';

import { styles } from './EditModifier.styled';
import { authType, materialClassesType, routerHistoryType, routerMatchType } from 'types';
import { modifiersService, notifyService } from 'services';
import { AlertDialog, Loader } from 'components/common';
import ModifierForm from './ModifierForm';
import { getErrorMessage } from 'sdk/utils';
import ROUTES from 'constants/routes';
import ModifierItems from './ModifierItems';
import { parseModifier, prepareModifier } from 'sdk/utils/modifiers';
import DefaultLayout from '../../../Layouts/DefaultLayout';

class EditModifier extends Component {
  static propTypes = {
    auth: authType.isRequired,
    match: routerMatchType.isRequired,
    classes: materialClassesType.isRequired,
    history: routerHistoryType.isRequired,
  };

  state = {
    isNew: false,
    activeTab: 0,
    modifierLoading: true,
    deleteModifierDialogOpen: false,
    deleteModifierDialogLoading: false,
    changeTabAlertOpen: false,
    modifier: {
      title: '',
      internal_name: '',
      items: [],
      required_choice: 'true',
      number_of_choices: 'minMax',
      number_of_choices_min: 0,
      number_of_choices_max: 1,
      unlimitedMax: false,
    },
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.getModifier();
    } else {
      this.setState({
        isNew: true,
        modifierLoading: false,
      });
    }
  }

  getModifier = async () => {
    const { id } = this.props.match.params;
    try {
      const restaurantId = this.props.auth.user.restaurant.id;
      const data = await modifiersService.getModifier(restaurantId, id);
      this.setState({
        modifier: parseModifier(data),
        modifierLoading: false,
      });
    } catch (error) {
      console.log('[getModifier] error', error.response);
      notifyService.showError(getErrorMessage(error));
    }
  };

  formIsDirty = false;

  handleTabChange = (e, val) => {
    if (this.formIsDirty && val === 1) {
      this.setState({ changeTabAlertOpen: true });
    } else {
      this.setState({ activeTab: val });
    }
  };

  handleSubmitForm = async (values, { setSubmitting }) => {
    try {
      const data = prepareModifier(values);
      const restaurantId = this.props.auth.user.restaurant.id;
      if (this.state.isNew) {
        await modifiersService.addModifier(restaurantId, data);
      } else {
        await modifiersService.editModifier(restaurantId, this.props.match.params.id, data);
      }
      this.formIsDirty = false;
      notifyService.showSuccess('Modifier is successfully saved');
      this.props.history.push(ROUTES.MODIFIERS);
    } catch (error) {
      console.log('[handleSubmitForm] error', error);
      notifyService.showError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  handleConfirmDeleteModifier = async () => {
    this.setState({ deleteModifierDialogLoading: true });
    try {
      const restaurantId = this.props.auth.user.restaurant.id;
      await modifiersService.deleteModifier(restaurantId, this.props.match.params.id);
      this.setState({
        deleteModifierDialogLoading: false,
        deleteModifierDialogOpen: false,
      });
      this.formIsDirty = false;
      notifyService.showSuccess('Modifier is successfully deleted');
      this.props.history.push(ROUTES.MODIFIERS);
    } catch (error) {
      console.log('[handleConfirmDeleteModifier] error', error.response);
      notifyService.showError(getErrorMessage(error));
      this.setState({
        deleteModifierDialogLoading: false,
      });
    }
  };

  render() {
    const {
      isNew,
      activeTab,
      modifier,
      modifierLoading,
      deleteModifierDialogOpen,
      deleteModifierDialogLoading,
      changeTabAlertOpen,
    } = this.state;
    const {
      classes,
    } = this.props;

    return (
      <DefaultLayout>
        <Container maxWidth="md">
          <Typography variant="h4">
            {`${isNew ? 'Create new' : 'Edit'}`} modifier
          </Typography>
          <Box mt={2}>
            <Paper square>
              <Tabs
                value={activeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                onChange={this.handleTabChange}
              >
                <Tab label="Modifier info" />
                <Tab label="Items with this modifier" />
              </Tabs>
            </Paper>
          </Box>
          {
            modifierLoading ? <Loader /> :
            <React.Fragment>
              {
                  activeTab === 0 ?
                    <ModifierForm
                      modifier={modifier}
                      onSubmit={this.handleSubmitForm}
                      onCancel={() => this.props.history.push(ROUTES.MODIFIERS)}
                      onDeleteModifier={() => this.setState({ deleteModifierDialogOpen: true })}
                      classes={classes}
                      isNew={isNew}
                      onSetDirty={dirty => {
                        this.formIsDirty = dirty;
                      }}
                    /> :
                    <ModifierItems
                      classes={classes}
                      modifierId={this.props.match.params.id}
                    />
                }
            </React.Fragment>
          }
          <AlertDialog
            isOpen={deleteModifierDialogOpen}
            isSubmitting={deleteModifierDialogLoading}
            title="Delete modifier"
            message="Do you really want to delete modifier ?"
            onClose={() => this.setState({ deleteModifierDialogOpen: false })}
            onConfirm={this.handleConfirmDeleteModifier}
          />
          <AlertDialog
            isOpen={changeTabAlertOpen}
            title="Leave form?"
            message="Do you really want to leave form? You've got unsaved changes."
            onClose={() => this.setState({ changeTabAlertOpen: false })}
            onConfirm={() => {
              this.setState({
                activeTab: 1,
                changeTabAlertOpen: false,
              });
              this.formIsDirty = false;
            }}
          />
        </Container>
      </DefaultLayout>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(withStyles(styles)(EditModifier));

