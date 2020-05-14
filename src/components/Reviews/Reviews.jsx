import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import Pagination from 'components/common/Pagination/Pagination';
import { listStyles } from './Reviews.styled';
import { notifyService as notifier, ReviewsService } from 'services';
import { materialClassesType, routerHistoryType } from 'types';
import { getQueryParam } from 'sdk/utils';
import DefaultLayout from '../Layouts/DefaultLayout';
import ReviewDialog from './ReviewDialog';
import ROUTES from 'constants/routes';
import { USER_ROLES } from 'constants/auth';

const getPaginationParams = () => ({
  page: +getQueryParam('page') || 0,
});

class Reviews extends Component {
  state = {
    reviewsList: [],
    page: 0,
    rowsPerPage: 25,
    totalReviews: 0,
    tableLoading: false,
    isOpenOrderDialog: false,
    order: null,
  };

  componentDidMount() {
    const paginationParams = getPaginationParams();

    this.setState(
      {
        ...paginationParams,
      },
      () => this.getListReviews(),
    );
  }

  getListReviews = async () => {
    this.setState({ tableLoading: true });
    const {
      rowsPerPage, page,
    } = this.state;
    const { selectedRestaurant } = this.props;
    const pageData = {
      limit: rowsPerPage,
      offset: rowsPerPage * page,
      sort_order: 'desc',
      sort_by: 'createdAt',
    };
    try {
      const data = await ReviewsService.getList(
        selectedRestaurant.id,
        pageData,
      );
      this.setState({
        reviewsList: data.result,
        tableLoading: false,
        totalReviews: Number(data.total),
      });
    } catch (error) {
      const { response } = error;
      this.setState({
        tableLoading: false,
      });
      notifier.showError(response && response.data && response.data.message ? response.data.message : 'Unknown error');
    }
  };

  handlePaginationChange = (pagination) => {
    this.setState(
      { ...pagination },
      () => this.getListReviews(),
    );
  };

  handleViewOrderDetails = order => {
    this.setState({ order, isOpenOrderDialog: true });
  }

  handleCloseOrderDialog = () => {
    this.setState({ isOpenOrderDialog: false });
  };

  render() {
    const {
      reviewsList,
      rowsPerPage,
      page,
      totalReviews,
      tableLoading,
      isOpenOrderDialog,
      order,
    } = this.state;
    const { classes, role } = this.props;
    const fromPage = page === 0 ? 1 : ((page + 1) * rowsPerPage) - (rowsPerPage - 1);
    const toPage = (page + 1) * rowsPerPage;
    const currentPage = totalReviews === 0 ? 0 : 1;
    return (
      <Fragment>
        <DefaultLayout>
          <Container>
            <Box mb={3}>
              <Typography variant="h4">
                Reviews
              </Typography>
            </Box>
            {
              tableLoading ? (
                <div className={classes.progressContainer}>
                  <CircularProgress />
                </div>
              ) :
                <Grid>
                  <Box mb={1}>
                    <Grid container direction="row" alignItems="center">
                      <Box mr={3}>
                        <Typography variant="h5">
                          Respond to reviews
                        </Typography>
                      </Box>
                      <Typography>
                        <b>{`${fromPage > totalReviews ? currentPage : fromPage}-${toPage > totalReviews ? totalReviews : toPage}  `}</b>
                        <span>of</span>
                        <b>{` ${totalReviews} `}</b>
                        <span>reviews</span>
                      </Typography>
                    </Grid>
                  </Box>
                  <Grid className={classes.root}>
                    <Grid className={classes.table}>
                      <Grid>
                        {
                          reviewsList.map(review => (
                            <Card key={review.id} className={classes.contentReview}>
                              <CardHeader
                                className={classes.headerReview}
                                title={
                                  <Typography>
                                    {review.user && `${review.user.first_name} ${review.user.last_name ? review.user.last_name : ''}`}
                                  </Typography>
                                }
                              />
                              <CardContent>
                                <Typography className={classes.reviewText}>
                                  {review.message}
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className={classes.button}
                                  onClick={() => { this.handleViewOrderDetails(review.order); }}
                                >
                                  View order details
                                </Button>
                                {
                                  role !== USER_ROLES.ROOT &&
                                  <Button
                                    onClick={() => this.props.history.push(`${ROUTES.MESSAGES}/${review.user.id}`)}
                                    variant="contained"
                                  >
                                    Message user
                                  </Button>
                                }
                              </CardContent>
                            </Card>
                          ))
                        }
                      </Grid>
                    </Grid>
                    <Grid className={classes.pagination}>
                      <Pagination
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChange={this.handlePaginationChange}
                        totalRows={totalReviews}
                        history={this.props.history}
                      />
                    </Grid>
                  </Grid>
                </Grid>
            }
            {
            order &&
            <ReviewDialog
              isOpen={isOpenOrderDialog}
              handleClose={this.handleCloseOrderDialog}
              order={order}
              handleOpenCancel={() => {}}
              handleOpenRefund={() => {}}
            />
            }
          </Container>
        </DefaultLayout>
      </Fragment>
    );
  }
}

Reviews.propTypes = {
  history: routerHistoryType.isRequired,
  classes: materialClassesType.isRequired,
  selectedRestaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  role: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedRestaurant: state.auth.user.restaurant,
  role: state.auth.user.role,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(listStyles)(withRouter(Reviews)));
