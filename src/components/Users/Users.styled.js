export const listStyles = theme => ({
  tableContainer: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  emptyRestaurantMessage: {
    marginTop: theme.spacing(3),
  },
  actionsBlock: {
    paddingLeft: theme.spacing(0.5),
  },
});

export const editStyles = theme => ({
  formButton: {
    margin: theme.spacing(2),
  },
  progressContainer: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
});
