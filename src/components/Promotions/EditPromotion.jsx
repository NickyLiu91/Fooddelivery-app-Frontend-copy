import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Grid,
  Checkbox,
  Button,
  CircularProgress,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { routerHistoryType, routerMatchType, materialClassesType, authType, routerLocationType } from 'types';
import DefaultLayout from 'components/Layouts/DefaultLayout';
import { PromotionsService, notifyService } from 'services';
import { Loader, ConfirmLeaving, Search } from 'components/common';
import { validationSchema, additionalValidation } from './validationSchema';
import { withStyles } from '@material-ui/styles';
import { styles } from './EditPromotion.styled';
import { offers, defaultWeekDays } from 'constants/promotions';
import { parsePromo, preparePromo } from 'sdk/utils/promotions';
import { RESTAURANTS_PATH, MENU_ITEMS_PATH } from 'constants/apiPaths';
import { getErrorMessage } from 'sdk/utils';


export class EditPromotion extends Component {
  static propTypes = {
    history: routerHistoryType.isRequired,
    match: routerMatchType.isRequired,
    classes: materialClassesType.isRequired,
    auth: authType.isRequired,
    location: routerLocationType.isRequired,
  }

  state ={
    loading: true,
    promoId: null,
    promo: {
      name: '',
      description: '',
      code: '',
      offer: offers.DOLLAR,
      price_discount: '',
      percentage_discount: '',
      free_menu_item: '',
      max_discount: '',
      orders_amount: 'one',
      min_order_amount: '',
      ongoing: false,
      start_date: moment(),
      start_time: moment(),
      end_date: moment().add(7, 'days'),
      end_time: moment(),
      week_days: defaultWeekDays,
      status: 'active',
      endDateInPast: false,
      multiple_usage: 'once',
    },
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { location } = this.props;
    this.activeForTodayExist = location.state && location.state.activeForTodayExist;
    if (id || id === 0) {
      this.setState(
        {
          promoId: id,
          endDateInPast: !!location.state && location.state.endDateInPast,
        },
        () => this.getPromo(),
      );
    } else {
      this.setState({ loading: false });
    }
  }

  setInitDateError(setErrors) {
    this.setState({ endDateInPast: false });
    setErrors({ end_date: 'please change the end date' });
  }

  getPromo = async () => {
    try {
      this.setState({ loading: true });
      const data = await PromotionsService.getPromotion(this.state.promoId);
      this.setState({
        promo: parsePromo(data),
        loading: false,
      });
    } catch (error) {
      console.log('[getPromo] error', error);
    }
  }

  handleCodeChange = (value, handleChange) => {
    handleChange({ target: { name: 'code', value: value.toUpperCase() } });
  }

  handleSubmit = async (data, methods) => {
    try {
      const errors = additionalValidation(data);
      if (!isEmpty(errors)) {
        methods.setErrors(errors);
        methods.setSubmitting(false);
      } else {
        await this.savePromo(data);
      }
    } catch (error) {
      console.error('error', error);
      notifyService.showError(getErrorMessage(error));
      methods.setSubmitting(false);
    }
  }

  savePromo = async (data) => {
    const promo = preparePromo(data);
    if (this.state.promoId) {
      await PromotionsService.updatePromotion(this.state.promoId, promo);
    } else {
      await PromotionsService.createPromotion(promo);
    }
    notifyService.showSuccess(`Promotion is successfully ${this.state.promoId ? 'updated' : 'created'}`);
    this.props.history.goBack();
  }

  render() {
    const {
      loading,
      promoId,
      promo,
      endDateInPast,
    } = this.state;
    const { classes, history } = this.props;
    const restaurantId = this.props.auth.user.restaurant.id;
    return (
      <DefaultLayout>
        <Container>
          <Typography variant="h4">
            Edit promotion
          </Typography>
          <Box>
            {
            loading && promoId ?
              <Loader /> :
              <Formik
                initialValues={promo}
                onSubmit={this.handleSubmit}
                validationSchema={validationSchema}
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
                    dirty,
                    setErrors,
                  } = props;
                  if (endDateInPast && values.end_date) {
                    this.setInitDateError(setErrors);
                  }
                  return (
                    <Box mt={2}>
                      <Paper className={classes.formPaper}>
                        <form onSubmit={handleSubmit}>
                          <TextField
                            label="Promotion Name*"
                            name="name"
                            error={errors.name && touched.name}
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={
                              (errors.name && touched.name)
                              && errors.name
                            }
                            margin="normal"
                            fullWidth
                          />
                          <TextField
                            label="Promotion Description"
                            name="description"
                            error={errors.description && touched.description}
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={
                              (errors.description && touched.description)
                              && errors.description
                            }
                            margin="normal"
                            fullWidth
                            multiline
                          />
                          <TextField
                            label="Promotion Code*"
                            name="code"
                            error={errors.code && touched.code}
                            value={values.code}
                            onChange={e => handleChange({ target: { name: 'code', value: e.target.value.toUpperCase() } })}
                            onBlur={handleBlur}
                            helperText={
                              (errors.code && touched.code)
                              && errors.code
                            }
                            margin="normal"
                            fullWidth
                          />
                          <Box mt={2}>
                            <Typography color="primary" gutterBottom>Promotion Type</Typography>
                            <RadioGroup name="multiple_usage" value={values.multiple_usage} onChange={handleChange} row>
                              <FormControlLabel value="once" control={<Radio color="primary" />} label="One-time code" />
                              <FormControlLabel value="multiple" control={<Radio color="primary" />} label="Multiple use code" />
                            </RadioGroup>
                          </Box>
                          <Box mt={3}>
                            <FormControl>
                              <Typography color="primary" gutterBottom>Promotion Offer</Typography>
                              <RadioGroup name="offer" value={values.offer} onChange={handleChange}>
                                <FormControlLabel value={offers.DOLLAR} control={<Radio color="primary" />} label="Dollar off" />
                                {
                                values.offer === offers.DOLLAR &&
                                <TextField
                                  name="price_discount"
                                  // label="Delivery fee"
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }}
                                  error={errors.price_discount && touched.price_discount}
                                  value={values.price_discount}
                                  onChange={handleChange}
                                  helperText={
                                    (errors.price_discount && touched.price_discount)
                                    && errors.price_discount
                                  }
                                  onBlur={handleBlur}
                                  margin="dense"
                                  className={classes.numberInput}
                                />
                                }
                                <FormControlLabel value={offers.PERCENT} control={<Radio color="primary" />} label="Percentage off" />
                                {
                                values.offer === offers.PERCENT &&
                                <TextField
                                  name="percentage_discount"
                                  // label="Delivery fee"
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                  }}
                                  error={errors.percentage_discount && touched.percentage_discount}
                                  value={values.percentage_discount}
                                  onChange={handleChange}
                                  helperText={
                                    (errors.percentage_discount && touched.percentage_discount)
                                    && errors.percentage_discount
                                  }
                                  onBlur={handleBlur}
                                  margin="dense"
                                  fullWidth
                                  className={classes.numberInput}
                                />
                                }
                                <FormControlLabel value={offers.ITEM} control={<Radio color="primary" />} label="Free menu item" />
                              </RadioGroup>
                            </FormControl>
                            {
                            values.offer === offers.ITEM &&
                            <Grid container spacing={3}>
                              <Grid item xs={4}>
                                <Search
                                  initialValue={values.free_menu_item}
                                  error={errors.free_menu_item && touched.free_menu_item}
                                  helperText={
                                    (errors.free_menu_item && touched.free_menu_item)
                                    && errors.free_menu_item
                                  }
                                  label="Find item"
                                  placeholder="Start typing..."
                                  onChange={value => handleChange({ target: { name: 'free_menu_item', value } })}
                                  optionLabel="name"
                                  searchApiUrl={`${RESTAURANTS_PATH}/${restaurantId}${MENU_ITEMS_PATH}`}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  style={{ minWidth: '215px' }}
                                  name="max_discount"
                                  label="Maximum discount (optional)"
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }}
                                  error={errors.max_discount && touched.max_discount}
                                  value={values.max_discount}
                                  onChange={handleChange}
                                  helperText={
                                    (errors.max_discount && touched.max_discount)
                                    && errors.max_discount
                                  }
                                  onBlur={handleBlur}
                                  margin="dense"
                                />
                              </Grid>
                            </Grid>
                            }
                          </Box>
                          <Box mt={2}>
                            <Typography color="primary" gutterBottom>Order Amount constraint</Typography>
                            <FormControl>
                              <TextField
                                name="min_order_amount"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                error={errors.min_order_amount && touched.min_order_amount}
                                value={values.min_order_amount}
                                onChange={handleChange}
                                helperText={
                                  (errors.min_order_amount && touched.min_order_amount)
                                  && errors.min_order_amount
                                }
                                onBlur={handleBlur}
                                margin="dense"
                                fullWidth
                                className={classes.numberInput}
                              />
                            </FormControl>
                          </Box>
                          <Box mt={2}>
                            <Typography color="primary" gutterBottom>Promotion valid period</Typography>
                            <Grid container spacing={3}>
                              <Grid item xs={3}>
                                <DatePicker
                                  label="Start date"
                                  disablePast
                                  // minDate={moment()}
                                  error={errors.start_date && touched.start_date}
                                  helperText={
                                    (errors.start_date && touched.start_date)
                                    && errors.start_date
                                  }
                                  value={values.start_date}
                                  onChange={date => handleChange({ target: { name: 'start_date', value: date } })}
                                  format="MM/DD/YYYY"
                                />
                              </Grid>
                              {
                              !values.ongoing &&
                              <Grid item xs={3}>
                                <DatePicker
                                  label="End date"
                                  disablePast
                                  clearable
                                  error={!!errors.end_date}
                                  helperText={errors.end_date}
                                  value={values.end_date}
                                  onChange={date => handleChange({ target: { name: 'end_date', value: date } })}
                                  format="MM/DD/YYYY"
                                />
                              </Grid>
                              }
                              <Grid item xs={3}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values.ongoing}
                                      onChange={handleChange}
                                      value={values.ongoing}
                                      color="primary"
                                      name="ongoing"
                                    />
                                  }
                                  label="Ongoing"
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                              <Grid item xs={3}>
                                <TimePicker
                                  label="Start time"
                                  minutesStep={5}
                                  error={!!errors.start_time}
                                  helperText={errors.start_time}
                                  value={values.start_time}
                                  onChange={time => handleChange({ target: { name: 'start_time', value: time } })}
                                />
                              </Grid>
                              {
                              !values.ongoing &&
                              <Grid item xs={3}>
                                <TimePicker
                                  label="End time"
                                  minutesStep={5}
                                  error={!!errors.end_time}
                                  helperText={errors.end_time}
                                  value={values.end_time}
                                  onChange={time => handleChange({ target: { name: 'end_time', value: time } })}
                                />
                              </Grid>
                              }
                            </Grid>
                          </Box>
                          <Box mt={2}>
                            <Typography color="primary" gutterBottom>Day(s) of week</Typography>
                            <ToggleButtonGroup
                              onChange={(e, value) => handleChange({ target: { name: 'week_days', value } })}
                              value={values.week_days}
                              color="primary"
                              className={errors.week_days ? classes.daysError : ''}
                            >
                              {defaultWeekDays.map(day => (
                                <ToggleButton className={classes.toggleButton} color="primary" key={day} value={day} aria-label={day}>
                                  {day.slice(0, 3)}
                                </ToggleButton>
                              ))}
                            </ToggleButtonGroup>
                            {
                              errors.week_days &&
                              <Typography color="secondary">
                                {errors.week_days}
                              </Typography>
                            }
                          </Box>
                          <Box mt={2}>
                            <Typography color="primary" gutterBottom>Activation status</Typography>
                            <RadioGroup name="status" value={values.status} onChange={handleChange} row>
                              <FormControlLabel value="active" control={<Radio color="primary" />} label="Active" />
                              <FormControlLabel value="inactive" control={<Radio color="primary" />} label="Inactive" />
                            </RadioGroup>
                          </Box>
                          <ConfirmLeaving active={dirty && !isSubmitting} />
                          <Box mt={4} mb={2}>
                            <Box component="span" ml={2} mr={2}>
                              <Button
                                variant="contained"
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => history.goBack()}
                              >
                                Cancel
                              </Button>
                            </Box>
                            <Box component="span">
                              <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                                color="primary"
                              >
                                { isSubmitting ? <CircularProgress size={24} /> : 'Submit' }
                              </Button>
                            </Box>
                          </Box>
                        </form>
                      </Paper>
                    </Box>
                  );
                }}
              </Formik>
            }
          </Box>
        </Container>
      </DefaultLayout>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(styles)(EditPromotion));
