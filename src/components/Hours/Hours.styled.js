export const styles = theme => ({
  paper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3, 2),
  },
  paperHeader: {
    flex: 1,
  },
  editHoursButton: {
    marginBottom: theme.spacing(1),
  },
  formButton: {
    margin: theme.spacing(0, 1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  datePickerWrapper: {
    maxWidth: theme.spacing(25),
  },
});

// eslint-disable-next-line no-unused-vars
export const fieldStyles = theme => ({
  pickerWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  timePicker: {
    maxWidth: '201px',
  },
});
