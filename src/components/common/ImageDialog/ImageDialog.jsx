import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

import { ImageUpload, Loader } from 'components/common';
import { notifyService } from 'services';

// const RESOLUTION = '1000x375';
const propTypes = {
  openHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resolution: PropTypes.string.isRequired,
  allowDelete: PropTypes.bool.isRequired,
};

class ImageDialog extends Component {
  state = {
    image: null,
    submitting: false,
    loading: false,
  };

  setSubmitting = value => this.setState({ submitting: value });

  handleImageChange = data => {
    if (data) {
      const url = data.url.replace(`${data.external_key}/`, `${data.external_key}/${this.props.resolution}/${data.extension}/`);
      console.log('url', url);
      this.setState({ image: url, loading: true });
    } else {
      this.setState({ image: null, loading: false });
    }
  }

  handleImageLoad = () => this.setState({ loading: false });

  handleImageError = error => {
    console.log('[handleImageError] error', error);
    notifyService.showError('Image upload error.');
    this.setState({ image: null, loading: false });
  }

  handleSubmit = () => {
    const { setSubmitting } = this;
    const { image } = this.state;
    this.setState({ submitting: true });
    this.props.onSubmit({ image }, { setSubmitting });
  }

  deleteImg = () => {
    const { setSubmitting } = this;
    this.setState({ submitting: true });
    this.props.onSubmit({ image: null }, { setSubmitting });
  }

  render() {
    const {
      openHandler,
      closeHandler,
      isOpen,
      allowDelete,
    } = this.props;

    const {
      image,
      submitting,
      loading,
    } = this.state;

    return (
      <div>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={openHandler}
          fullWidth
          startIcon={<ImageIcon />}
        >
        Upload image
        </Button>
        <Dialog
          open={isOpen}
          onClose={closeHandler}
          fullWidth
          maxWidth="sm"
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Upload image</DialogTitle>
          <DialogContent>
            {
            image &&
            <React.Fragment>
              <Typography>Preview:</Typography>
              {
              loading && <Loader />
              }
              <img
                alt="Restaurant_profile"
                onLoad={this.handleImageLoad}
                onError={this.handleImageError}
                style={{ width: '100%' }}
                src={image}
              />
            </React.Fragment>
            }
            <Typography>
              Supported formats: PNG, JPG, JPEG
            </Typography>
            <ImageUpload onChange={this.handleImageChange} />
          </DialogContent>
          <DialogActions>
            {
              allowDelete &&
              <Button
                type="button"
                onClick={this.deleteImg}
                variant="contained"
                disabled={submitting}
                color="secondary"
              >
                Delete
              </Button>
            }
            <Button
              type="button"
              onClick={closeHandler}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              disabled={!image || loading || submitting}
              variant="contained"
              color="primary"
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ImageDialog.propTypes = propTypes;

export default ImageDialog;
