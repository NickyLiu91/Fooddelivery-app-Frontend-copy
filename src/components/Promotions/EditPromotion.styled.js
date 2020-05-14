export const styles = theme => ({
  formPaper: {
    padding: theme.spacing(3),
  },
  progressContainer: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
  numberInput: {
    width: '100px',
  },
  toggleButton: {
    padding: theme.spacing(0, 2),
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
  daysError: {
    boxShadow: '0px 0px 5px 1px rgba(255,0,0,1)',
  },
});
