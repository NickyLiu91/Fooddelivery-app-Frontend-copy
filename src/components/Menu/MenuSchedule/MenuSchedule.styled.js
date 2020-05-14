export const styles = theme => ({
  paper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3, 2),
  },
  helperText: {
    margin: theme.spacing(2, 1),
    color: theme.palette.error.main,
  },
  paperHeader: {
    flex: 1,
  },
  formButton: {
    margin: theme.spacing(0, 1),
  },
  scheduleInfoTitle: {
    marginBottom: theme.spacing(2),
  },
  scheduleItem: {
    border: '1px solid',
    borderColor: theme.palette.grey.A200,
    borderRadius: '5px',
    marginBottom: theme.spacing(1),
  },
  search: {
    maxWidth: '300px',
    marginBottom: '24px',
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
