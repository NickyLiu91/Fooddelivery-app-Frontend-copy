export const styles = theme => ({
  formPaper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  modifierIconWrapper: {
    minWidth: theme.spacing(6.5),
    marginTop: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      cursor: 'row-resize',
    },
  },
  deleteBtn: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(-1),
    marginTop: theme.spacing(0.75),
  },
  inputBgcWhite: {
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.common.white,
    },
  },
  minMaxInput: {
    width: '60px',
  },
  itemsList: {
    padding: 0,
  },
  listItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  modifiersError: {
    boxShadow: '0px 0px 5px 1px rgba(255,0,0,1)',
  },
});
