import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  Select,
  TextField,
  Typography,
  Box,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { listStyles, useStyles } from './Item.styled';
import { materialClassesType } from 'types';
import defaultImage from '../../../../assets/images/default-image.png';
import ItemUpdateDialog from './ItemUpdateDialog';
import PropTypes from 'prop-types';
import ImageDialog from 'components/common/ImageDialog/ImageDialog';


function ChipAvailabilityStatus(props) {
  const { availabilityStatus } = props;
  const availableForDays = props.notAvailableForDays;
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

class ItemInfo extends Component {
  state = {
    isOpenAvailabilityDialog: false,
    isOpenImageDialog: false,
  };

  handleOpenAvailability = () => {
    this.setState({ isOpenAvailabilityDialog: true });
  };

  handleCloseAvailability = () => {
    this.setState({
      isOpenAvailabilityDialog: false,
    });
  };

  handleOpenImageDialog = () => {
    this.setState({ isOpenImageDialog: true });
  };

  handleCloseImageDialog = () => {
    this.setState({
      isOpenImageDialog: false,
    });
  };

  handleImageSubmit = ({ image }, { setSubmitting }) => {
    setSubmitting(false);
    this.handleCloseImageDialog();
    this.props.handleChange({ target: { name: 'image', value: image } });
  }

  render() {
    const {
      classes,
      errors,
      touched,
      values,
      handleBlur,
      handleChange,
      sectionLoading,
    } = this.props;

    const { isOpenImageDialog } = this.state;

    return (
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4}>
                  <Typography variant="h6" component="p">
                    Item Info
                  </Typography>
                  <CardMedia
                    className={classes.media}
                    image={values.image || defaultImage}
                  />
                  <Box mt={2}>
                    <ImageDialog
                      allowDelete={!!values.image}
                      isOpen={isOpenImageDialog}
                      onSubmit={this.handleImageSubmit}
                      closeHandler={this.handleCloseImageDialog}
                      openHandler={this.handleOpenImageDialog}
                      resolution="700x400"
                    />
                  </Box>
                  <ChipAvailabilityStatus
                    availabilityStatus={values.availability_status}
                    notAvailableForDays={
                      (values.not_available_for_days === null) ?
                        1 :
                        values.not_available_for_days}
                  />
                  <Button
                    className={classes.availabilityButton}
                    variant="contained"
                    onClick={this.handleOpenAvailability}
                  >
                    Update availability
                  </Button>
                  <ItemUpdateDialog
                    isOpen={this.state.isOpenAvailabilityDialog}
                    closeHandler={this.handleCloseAvailability}
                    setFieldValue={this.props.setFieldValue}
                  />
                </Grid>
                <Grid item md={8}>
                  <Typography variant="h6" component="p">
                    Name*
                  </Typography>
                  <TextField
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    margin="dense"
                    onBlur={handleBlur}
                    error={errors.name && touched.name}
                    helperText={(errors.name && touched.name) && errors.name}
                    variant="outlined"
                    fullWidth
                  />
                  <Typography variant="h6" component="p">
                    Description
                  </Typography>
                  <TextField
                    name="description"
                    value={values.description}
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.description && touched.description}
                    helperText={(errors.description && touched.description) && errors.description}
                    multiline
                    rows="4"
                    variant="outlined"
                    fullWidth
                  />
                  <Grid container direction="row" alignItems="flex-start">
                    <Grid item>
                      <Typography variant="h6">
                        Price*
                      </Typography>
                      <TextField
                        name="price"
                        value={`${values.price}`}
                        onChange={handleChange}
                        margin="dense"
                        onBlur={handleBlur}
                        error={errors.price && touched.price}
                        helperText={(errors.price && touched.price) && errors.price}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        className={classes.price}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">
                        Section*
                      </Typography>
                      {sectionLoading ? (
                        <div className={classes.progressContainer}>
                          <CircularProgress />
                        </div>
                        ) :
                        <FormControl variant="outlined">
                          <Select
                            native
                            margin="dense"
                            name="menu_section"
                            value={values.menu_section}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={classes.selectedSection}
                            classes={{
                              select: classes.select,
                              outlined: classes.outlined,
                            }}
                            error={errors.menu_section && touched.menu_section}
                          >
                            {values.sections.map(section => (
                              <option value={section.id} label={section.name} key={section.id} />
                            ))}
                          </Select>
                          <FormHelperText
                            className={classes.helperText}
                            id="sections"
                          >{(errors.menu_section && touched.menu_section) && errors.menu_section}
                          </FormHelperText>
                        </FormControl>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

ItemInfo.propTypes = {
  classes: materialClassesType.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  errors: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  touched: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  sectionLoading: PropTypes.bool.isRequired,
};

ChipAvailabilityStatus.propTypes = {
  availabilityStatus: PropTypes.string.isRequired,
  notAvailableForDays: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});

export default connect(mapStateToProps)(withStyles(listStyles)(ItemInfo));
