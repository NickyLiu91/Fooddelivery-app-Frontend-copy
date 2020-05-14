export const styles = theme => ({
  mapWrapper: {
    position: 'relative',
  },
  editPanel: {
    position: 'absolute',
    top: theme.spacing(3),
    left: theme.spacing(3),
    width: theme.spacing(40),
    padding: theme.spacing(2),
    maxHeight: '450px',
    overflowY: 'auto',
  },
  zoneColorAvatar: {
    width: '20px',
    height: '20px',
    '& .MuiAvatar-fallback': {
      display: 'none',
    },
  },
  zoneName: {
    flex: '1 1',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  listIcon: {
    minWidth: '30px',
  },
});

export const listStyles = theme => ({
  boundaryRow: {
    cursor: 'pointer',
    '&.Mui-selected': {
      backgroundColor: theme.palette.grey[200],
    },
    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
});

export const mapContainerStyle = {
  height: '500px',
};

export const zonesColors = [
  '#0FBDFF',
  '#FF9E67',
  '#4DB545',
  '#EA4334',
  '#aa00ff',
  '#eeff41',
  '#f44336',
  '#a5d6a7',
  '#4e342e',
  '#78909c',
];
