import React, { Component } from 'react';
import { connect } from 'react-redux';
import { materialClassesType, routerHistoryType, routerMatchType } from 'types';
import { notifyService, notifyService as notifier, RestaurantProfileService } from 'services';
import ROUTES from 'constants/routes';
import { Button, CircularProgress, Container, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { listStyles } from './RestaurantProfile.styled';
import DefaultLayout from '../Layouts/DefaultLayout/index';
import AboutUs from './AboutUs/AboutUs';
import ContactUs from './ContactUs/ContactUs';
import OrderManagement from './OrderManagement/OrderManagement';
import Restaurant from './Restaurant/Restaurant';
import UpdateBackground from './UpdateBackground/UpdateBackground';
import Questions from './Questions/Questions';
import { convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import ConfirmLeaving from '../common/ConfirmLeaving/ConfirmLeaving';
import { setRestaurant } from 'actions/authActions';
import PropTypes from 'prop-types';

class RestaurantProfile extends Component {
  state = {
    newRestaurant: true,
    isOpenRestaurantDialog: false,
    isOpenOrderManagementDialog: false,
    isOpenContactUsDialog: false,
    isOpenAboutUsDialog: false,
    isOpenUpdateBackgroundDialog: false,
    isOpenQuestionAddDialog: false,
    restaurantLoading: true,
    isOpenDeleteDialog: false,
    questionToDelete: null,
    deleting: false,
    isOpenEditDialog: false,
    questionToEdit: { question: '', answer: '' },
    isEditNewRestaurant: false,
    modelNewRestaurant: null,
    restaurant: {
      id: '',
      name: '',
      address: {},
      image: null,
      delivery_min_price: 10,
      preparation_time: 15,
      delivery_time: 30,
      sales_tax: 20,
      phone: '',
      email: '',
      contact_person: '',
      about_us: '',
      questions: [],
    },
    isSavedRestaurant: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id || id === 0) {
      this.setState({
        newRestaurant: false,
      });
      this.getRestaurantData(id);
    } else {
      this.setState({
        restaurantLoading: false,
        modelNewRestaurant: this.state.restaurant,
      });
    }
  }

  getRestaurantData = async (id) => {
    try {
      const restaurantResponse = await RestaurantProfileService.getSingleRestaurant(id);
      const { restaurant } = this.state;

      this.setState({
        restaurantLoading: false,
        restaurant: {
          id: restaurantResponse.id,
          name: restaurantResponse.name,
          image: restaurantResponse.image,
          address: restaurantResponse.address,
          delivery_min_price: restaurantResponse.delivery_min_price ?
            restaurantResponse.delivery_min_price : restaurant.delivery_min_price,
          preparation_time: restaurantResponse.preparation_time ?
            restaurantResponse.preparation_time : restaurant.preparation_time,
          delivery_time: restaurantResponse.delivery_time ?
            restaurantResponse.delivery_time : restaurant.delivery_time,
          sales_tax: restaurantResponse.sales_tax ?
            restaurantResponse.sales_tax : restaurant.sales_tax,
          phone: restaurantResponse.phone,
          email: restaurantResponse.email,
          contact_person: restaurantResponse.contact_person,
          about_us: restaurantResponse.about_us ?
            restaurantResponse.about_us : restaurant.about_us,
          questions: restaurantResponse.questions,
          ordering_allowed: restaurantResponse.ordering_allowed,
        },
      });
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  saveRestaurant = async (RestaurantData) => {
    this.setState({
      isEditNewRestaurant: false,
      isSavedRestaurant: true,
    });
    try {
      await RestaurantProfileService.addRestaurant(RestaurantData);
      notifyService.showSuccess('New data is successfully saved');
      this.props.history.push(ROUTES.RESTAURANTS);
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleSubmitEdit = async (restaurantData, { setSubmitting }) => {
    const {
      restaurant,
    } = this.state;

    const newRestaurantData = {
      name: (restaurantData.name !== undefined) ? restaurantData.name : restaurant.name,
      address: restaurantData.address ?
        restaurantData.address : restaurant.address,
      image: (restaurantData.image !== undefined) ?
        restaurantData.image : restaurant.image,
      delivery_min_price: (restaurantData.delivery_min_price !== undefined) ?
        restaurantData.delivery_min_price : restaurant.delivery_min_price,
      preparation_time: (restaurantData.preparation_time !== undefined) ?
        restaurantData.preparation_time : restaurant.preparation_time,
      delivery_time: (restaurantData.delivery_time !== undefined) ?
        restaurantData.delivery_time : restaurant.delivery_time,
      sales_tax: (restaurantData.sales_tax !== undefined) ?
        restaurantData.sales_tax : restaurant.sales_tax,
      phone: (restaurantData.phone !== undefined) ?
        restaurantData.phone : restaurant.phone,
      email: (restaurantData.email !== undefined) ?
        restaurantData.email : restaurant.email,
      contact_person: (restaurantData.contact_person !== undefined) ?
        restaurantData.contact_person : restaurant.contact_person,
      about_us: (restaurantData.about_us !== undefined) ?
        convertToHTML(restaurantData.about_us.getCurrentContent()) : restaurant.about_us,
      questions: restaurant.questions,
    };

    try {
      await RestaurantProfileService.updateRestaurant(this.state.restaurant.id, newRestaurantData);
      this.getRestaurantData(this.state.restaurant.id);
      notifyService.showSuccess('New data is successfully saved');
      if (restaurant.id === this.props.selectedRestaurant.id) {
        this.props.changeRestaurant({
          id: restaurant.id,
          ordering_allowed: restaurant.ordering_allowed,
          ...newRestaurantData,
        });
      }
      this.handleClose();
      setSubmitting(false);
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
      setSubmitting(false);
    }
  };

  handleOpen = (state) => {
    this.setState({ [state]: true });
  };

  handleClose = () => {
    this.setState({
      isOpenRestaurantDialog: false,
      isOpenOrderManagementDialog: false,
      isOpenContactUsDialog: false,
      isOpenAboutUsDialog: false,
      isOpenUpdateBackgroundDialog: false,
      isOpenQuestionAddDialog: false,
      isOpenEditDialog: false,
    });
  };

  handleSubmitAdd = async (restaurantData, { setSubmitting }) => {
    const { restaurant } = this.state;
    let aboutUs = restaurant.about_us;

    if (restaurantData.about_us !== undefined &&
      restaurantData.about_us.getCurrentContent().getPlainText().length !== 0) {
      aboutUs = convertToHTML(restaurantData.about_us.getCurrentContent());
    }

    if (restaurantData.about_us !== undefined &&
      restaurantData.about_us.getCurrentContent().getPlainText().length === 0) {
      aboutUs = '';
    }

    try {
      this.setState(prevState => ({
        restaurant: {
          ...prevState.restaurant,
          name: (restaurantData.name !== undefined) ?
            restaurantData.name : restaurant.name,
          address: (restaurantData.address !== undefined) ?
            restaurantData.address : restaurant.address,
          image: (restaurantData.image !== undefined) ?
            restaurantData.image : restaurant.image,
          delivery_min_price: (restaurantData.delivery_min_price !== undefined) ?
            restaurantData.delivery_min_price : restaurant.delivery_min_price,
          preparation_time: (restaurantData.preparation_time !== undefined) ?
            restaurantData.preparation_time : restaurant.preparation_time,
          delivery_time: (restaurantData.delivery_time !== undefined) ?
            restaurantData.delivery_time : restaurant.delivery_time,
          sales_tax: (restaurantData.sales_tax !== undefined) ?
            restaurantData.sales_tax : restaurant.sales_tax,
          phone: (restaurantData.phone !== undefined) ?
            restaurantData.phone : restaurant.phone,
          email: (restaurantData.email !== undefined) ?
            restaurantData.email : restaurant.email,
          contact_person: (restaurantData.contact_person !== undefined) ?
            restaurantData.contact_person : restaurant.contact_person,
          about_us: aboutUs,
          questions: restaurant.questions,
        },
      }));

      if (JSON.stringify(this.state.modelNewRestaurant) !== JSON.stringify(this.state.restaurant)) {
        this.setState({
          isEditNewRestaurant: true,
        });
      } else {
        this.setState({
          isEditNewRestaurant: false,
        });
      }

      notifyService.showSuccess('New data is successfully added');
      this.handleClose();
      setSubmitting(false);
    } catch (error) {
      const { response } = error;
      notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleSaveQuestion = async (restaurantData, { setSubmitting, resetForm }) => {
    const questions = [];
    const newQuestion = {
      question: restaurantData.question,
      answer: convertToHTML(restaurantData.answer.getCurrentContent()),
    };
    let updatedQuestions = this.state.restaurant.questions;
    questions.push(newQuestion);
    updatedQuestions = [...this.state.restaurant.questions, ...questions];

    try {
      if (this.state.restaurant.id) {
        await RestaurantProfileService.postQuestion(this.state.restaurant.id, newQuestion);
        this.getRestaurantData(this.state.restaurant.id);
      }
      this.setState(prevState => ({
        restaurant: {
          ...prevState.restaurant,
          questions: updatedQuestions,
        },
      }));
      if (this.state.restaurant.questions.length !== 0) {
        this.setState({
          isEditNewRestaurant: true,
        });
      } else {
        this.setState({
          isEditNewRestaurant: false,
        });
      }
      notifier.showSuccess('New data is successfully added');
      this.handleClose();
      setSubmitting(false);
      resetForm({
        question: '',
        answer: EditorState.createEmpty(),
      });
    } catch (error) {
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleDeleteQuestion = async () => {
    const {
      restaurant,
      questionToDelete,
    } = this.state;
    const updatedQuestions =
      restaurant.questions.filter((question) => question.question !== questionToDelete.question);

    this.setState({ deleting: true });

    try {
      if (this.state.restaurant.id) {
        await RestaurantProfileService.deleteQuestion(
          this.state.restaurant.id,
          this.state.questionToDelete.id,
        );
      }
      this.setState(prevState => ({
        deleting: false,
        questionToDelete: null,
        isOpenDeleteDialog: false,
        restaurant: {
          ...prevState.restaurant,
          questions: updatedQuestions,
        },
      }));
      if (updatedQuestions.length !== 0) {
        this.setState({
          isEditNewRestaurant: true,
        });
      } else {
        this.setState({
          isEditNewRestaurant: false,
        });
      }
      notifier.showInfo('Question is successfully deleted');
    } catch (error) {
      this.setState({ deleting: false });
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handleDelete = (question) => {
    this.setState({
      questionToDelete: question,
      isOpenDeleteDialog: true,
    });
  };

  handleDeleteClose = () => {
    if (!this.state.deleting) {
      this.setState({ isOpenDeleteDialog: false });
    }
  };

  handleEdit = (question) => {
    this.setState({
      questionToEdit: question,
      isOpenEditDialog: true,
    });
  };

  handleEditClose = () => {
    this.setState({ isOpenEditDialog: false });
  };

  handleQuestionEdit = async (restaurantData, { setSubmitting, resetForm }) => {
    const newQuestion = {
      question: restaurantData.question,
      answer: convertToHTML(restaurantData.answer.getCurrentContent()),
    };
    const questions = [...this.state.restaurant.questions];
    const index =
      questions.findIndex(question => question.question === this.state.questionToEdit.question);

    if (index !== -1) {
      questions[index] = newQuestion;
    } else {
      questions.push(newQuestion);
    }

    try {
      if (this.state.restaurant.id && this.state.questionToEdit.id) {
        await RestaurantProfileService.putQuestion(
          this.state.restaurant.id,
          this.state.questionToEdit.id,
          newQuestion,
        );
        this.getRestaurantData(this.state.restaurant.id);
      }
      this.setState(prevState => ({
        restaurant: {
          ...prevState.restaurant,
          questions,
        },
      }));
      notifier.showSuccess('New data is successfully saved');
      this.handleEditClose();
      setSubmitting(false);
      resetForm({
        question: '',
        answer: EditorState.createEmpty(),
      });
    } catch (error) {
      const { response } = error;
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
      setSubmitting(false);
    }
  };

  render() {
    const {
      isOpenRestaurantDialog,
      isOpenOrderManagementDialog,
      isOpenContactUsDialog,
      isOpenAboutUsDialog,
      isOpenUpdateBackgroundDialog,
      isOpenQuestionAddDialog,
      restaurant,
      restaurantLoading,
      newRestaurant,
      isOpenDeleteDialog,
      questionToDelete,
      deleting,
      isOpenEditDialog,
      questionToEdit,
      isEditNewRestaurant,
    } = this.state;

    const { classes } = this.props;

    return (
      <DefaultLayout>
        <Container>
          <div>
            {newRestaurant ?
              <div>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  className={classes.saveButton}
                  onClick={() => {
                  this.saveRestaurant(restaurant);
                }}
                  disabled={!restaurant.name || !restaurant.address || this.state.isSavedRestaurant}
                >
                Save
                </Button>
                <ConfirmLeaving active={isEditNewRestaurant} />
              </div>
              : ''}
          </div>
          {!restaurantLoading ? (
            <Grid container spacing={3}>
              <UpdateBackground
                image={restaurant.image}
                isOpen={isOpenUpdateBackgroundDialog}
                closeHandler={this.handleClose}
                onSubmit={newRestaurant ? this.handleSubmitAdd :
                  this.handleSubmitEdit}
                openHandler={() => {
                  this.handleOpen('isOpenUpdateBackgroundDialog');
                }}
              />
              <Restaurant
                defaultData={{
                  name: restaurant.name,
                  address: restaurant.address,
                }}
                submitHandler={newRestaurant ? this.handleSubmitAdd :
                  this.handleSubmitEdit}
                isOpen={isOpenRestaurantDialog}
                closeHandler={this.handleClose}
                openHandler={() => {
                  this.handleOpen('isOpenRestaurantDialog');
                }}
              />
              <OrderManagement
                defaultData={{
                  delivery_min_price: restaurant.delivery_min_price,
                  preparation_time: restaurant.preparation_time,
                  delivery_time: restaurant.delivery_time,
                  sales_tax: restaurant.sales_tax,
                }}
                submitHandler={newRestaurant ? this.handleSubmitAdd : this.handleSubmitEdit}
                isOpen={isOpenOrderManagementDialog}
                closeHandler={this.handleClose}
                openHandler={() => {
                  this.handleOpen('isOpenOrderManagementDialog');
                }}
              />
              <ContactUs
                phone={restaurant.phone}
                email={restaurant.email}
                contactPerson={restaurant.contact_person}
                submitHandler={newRestaurant ? this.handleSubmitAdd : this.handleSubmitEdit}
                isOpen={isOpenContactUsDialog}
                closeHandler={this.handleClose}
                openHandler={() => {
                  this.handleOpen('isOpenContactUsDialog');
                }}
              />
              <AboutUs
                defaultData={{ about_us: restaurant.about_us }}
                submitHandler={newRestaurant ? this.handleSubmitAdd : this.handleSubmitEdit}
                isOpen={isOpenAboutUsDialog}
                closeHandler={this.handleClose}
                openHandler={() => {
                  this.handleOpen('isOpenAboutUsDialog');
                }}
              />
              <Questions
                defaultData={restaurant}
                restaurantHandler={this.getRestaurantData}
                handleSubmitAdd={this.handleSaveQuestion}
                isOpen={isOpenQuestionAddDialog}
                closeHandler={this.handleClose}
                openHandler={() => {
                  this.handleOpen('isOpenQuestionAddDialog');
                }}
                isOpenDeleteDialog={isOpenDeleteDialog}
                handleDeleteClose={this.handleDeleteClose}
                handleDeleteConfirm={this.handleDeleteQuestion}
                handleDelete={this.handleDelete}
                questionToDelete={questionToDelete}
                deleting={deleting}
                isOpenEditDialog={isOpenEditDialog}
                questionToEdit={questionToEdit}
                handleQuestionEdit={this.handleQuestionEdit}
                handleEdit={this.handleEdit}
              />
            </Grid>
          ) : (
            <div className={classes.progressContainer}>
              <CircularProgress />
            </div>
          )}
        </Container>
      </DefaultLayout>
    );
  }
}

RestaurantProfile.propTypes = {
  match: routerMatchType.isRequired,
  classes: materialClassesType.isRequired,
  history: routerHistoryType.isRequired,
  selectedRestaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  changeRestaurant: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedRestaurant: state.auth.user.restaurant,
});

const mapDispatchToProps = dispatch => ({
  changeRestaurant: restaurant => dispatch(setRestaurant(restaurant)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(listStyles)(RestaurantProfile));
