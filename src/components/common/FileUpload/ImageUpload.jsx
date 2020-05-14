/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, CircularProgress, IconButton, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CloseIcon from '@material-ui/icons/Close';

import { imageStyles, StyledUploadImage, StyledImageWrapper } from './upload.styled';
import { materialClassesType } from 'types';
import { uploadService, notifyService } from 'services';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

class ImageUpload extends Component {
  state = {
    imageURL: null,
    uploading: false,
    submitted: false,
    error: false,
    errorMessage: null,
  }

  handleSubmit = async e => {
    const file = e.target.files[0];
    const invalidSize = file.size > MAX_IMAGE_SIZE;
    this.setState({
      uploading: !invalidSize,
      submitted: true,
      imageURL: URL.createObjectURL(file),
      error: invalidSize,
      errorMessage: invalidSize ? 'Maximum allowed size is 8 MB' : null,
    });
    if (!invalidSize) {
      try {
        const { data } = await uploadService.uploadImage(file);
        this.setState({ uploading: false });
        this.props.onChange(data);
      } catch (error) {
        console.log('[handleSubmit] error', error);
        this.setState({ uploading: false, error: true });
        const { response } = error;
        notifyService.showError(response && response.data && response.data.message ? response.data.message : 'Image upload error');
      }
    }
  }

  removeImgHandler = () => {
    this.setState({
      imageURL: null,
      uploading: false,
      submitted: false,
      error: false,
      errorMessage: null,
    });
    this.props.onChange(null);
  }

  render() {
    const {
      classes,
      label,
    } = this.props;
    const {
      submitted,
      uploading,
      imageURL,
      error,
      errorMessage,
    } = this.state;

    return (
      <Box>
        { !submitted ?
          <React.Fragment>
            <input
              accept="image/jpeg,image/png,image/gif,image/bmp"
              className={classes.input}
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={this.handleSubmit}
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                component="span"
                color="primary"
                className={classes.button}
                startIcon={<PhotoCamera />}
              >
                {label}
              </Button>
            </label>
          </React.Fragment>
          :
          <React.Fragment>
            <StyledImageWrapper error={error}>
              <StyledUploadImage
                src={imageURL}
                alt=""
                uploading={uploading}
                error={error}
              />
              { uploading && <CircularProgress className={classes.imageProgress} /> }
              { !uploading &&
                <IconButton
                  className={classes.removeImageBtn}
                  onClick={this.removeImgHandler}
                >
                  <CloseIcon />
                </IconButton>
              }
            </StyledImageWrapper>
            {
              errorMessage &&
              <Typography color="error">
                {errorMessage}
              </Typography>
            }
          </React.Fragment>
        }
      </Box>
    );
  }
}

ImageUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
  classes: materialClassesType.isRequired,
  label: PropTypes.string,
};

ImageUpload.defaultProps = {
  label: 'Upload Image',
};

export default withStyles(imageStyles)(ImageUpload);
