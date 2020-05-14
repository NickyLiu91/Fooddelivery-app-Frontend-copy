/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/styles';
import { fileStyles } from './upload.styled';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  Chip,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import GetAppIcon from '@material-ui/icons/GetApp';

import exampleFile from 'assets/files/menu_items_file_example.xlsx';
import { materialClassesType } from 'types';
import { uploadService, notifyService } from 'services';
import { getErrorMessage } from 'sdk/utils';

const parseErrors = (errors) => {
  const result = {};
  Object.keys(errors).forEach(key => {
    const parsedKey = key.replace('_', ' ');
    result[parsedKey] = errors[key][Object.keys(errors[key])[0]];
  });
  return result;
};

const propTypes = {
  classes: materialClassesType.isRequired,
  label: PropTypes.string,
  restaurantId: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

// waiting for requirements
function FileUpload({
  classes,
  label,
  restaurantId,
  onComplete,
  disabled,
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState(null);

  function handleDeleteFile() {
    setFile(null);
    setErrors(null);
  }

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      handleDeleteFile();
    }
  };


  function handleUpload(e) {
    setFile(e.target.files[0]);
  }

  async function handleSubmit() {
    setLoading(true);
    const requestOptions = {

    };
    try {
      await uploadService.uploadMenuItems(restaurantId, file, requestOptions);
      onComplete();
      notifyService.showSuccess('Items are successfully added');
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors: errorsRaw } = error.response.data;
        setErrors(parseErrors(errorsRaw));
      }
      console.log('[upload file] handleSubmit error', error.response);
      notifyService.showError(getErrorMessage(error));
    }
  }

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        disabled={disabled}
        className={classes.button}
        onClick={() => setOpen(true)}
        startIcon={<CloudUploadIcon />}
      >
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title">Upload menu items from file</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can download
            <Button
              component="a"
              href={exampleFile}
              size="small"
              color="primary"
            >
              File example
              <GetAppIcon />
            </Button>
          </DialogContentText>
          <Typography gutterBottom >
            Supported formats: .xls, .xlsx
          </Typography>
          {
          file ?
            <Chip
              label={file.name}
              onDelete={handleDeleteFile}
              color={errors ? 'secondary' : 'primary'}
            />
            :
            <Box>
              <input
                accept=".xls, .xlsx"
                className={classes.input}
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleUpload}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                  color="primary"
                  disabled={loading}
                  startIcon={<CloudUploadIcon />}
                >
                  {label}
                </Button>
              </label>
            </Box>
          }
          {
          errors &&
          <React.Fragment>
            <Typography color="error">
              File contains errors:
            </Typography>
            {Object.keys(errors).map(key => (
              <Typography key={key} color="error">
                {key}: {errors[key]}
              </Typography>
            ))}
          </React.Fragment>
          }
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={!file || loading}
            onClick={handleSubmit}
            color="primary"
          >
            { loading ? <CircularProgress size={24} /> :
              'Submit'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* </label> */}
    </div>
  );
}

FileUpload.propTypes = propTypes;

FileUpload.defaultProps = {
  label: 'Upload',
  disabled: false,
};

export default connect(state => ({
  restaurantId: state.auth.user.restaurant.id,
}))(withStyles(fileStyles)(FileUpload));
