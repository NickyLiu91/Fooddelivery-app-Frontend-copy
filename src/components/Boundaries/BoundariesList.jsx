import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { listStyles } from './Boundaries.styled';
import { materialClassesType } from 'types';
import { boundaryStatuses } from 'constants/boundaries';

function BoundaryMenu({
  isActive,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { handleClose(); onToggleActive(); }}>
          {`${isActive ? 'Inactivate' : 'Activate'} boundary`}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onEdit(); }}>
          Edit boundary
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onDelete(); }}>
          Delete boundary
        </MenuItem>
      </Menu>
    </div>
  );
}

BoundaryMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

function BoundariesList({
  list,
  onSelectBoundary,
  classes,
  selectedId,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Boundary name</TableCell>
            <TableCell>Last active</TableCell>
            <TableCell>Last updated</TableCell>
            <TableCell>Updated By</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {
            list && !!list.length ?
            list.map(boundary => (
              <TableRow
                hover
                selected={selectedId === boundary.id}
                className={classes.boundaryRow}
                key={boundary.id}
                tabIndex="0"
              >
                <TableCell
                  onClick={() => onSelectBoundary(boundary)}
                >
                  {boundary.name}
                </TableCell>
                <TableCell
                  onClick={() => onSelectBoundary(boundary)}
                >
                  {boundary.last_active_at && moment.utc(boundary.last_active_at).local().format('YYYY-MM-DD hh:mm a')}
                </TableCell>
                <TableCell
                  onClick={() => onSelectBoundary(boundary)}
                >
                  {boundary.updated_at && moment.utc(boundary.updated_at).local().format('YYYY-MM-DD hh:mm a')}
                </TableCell>
                <TableCell
                  onClick={() => onSelectBoundary(boundary)}
                >
                  {`${boundary.updated_by.first_name} ${boundary.updated_by.last_name}`}
                </TableCell>
                <TableCell
                  onClick={() => onSelectBoundary(boundary)}
                >
                  <Chip
                    color={boundary.status === 'active' ? 'primary' : 'default'}
                    label={boundary.status}
                  />
                </TableCell>
                <TableCell style={{ width: '50px' }}>
                  <BoundaryMenu
                    onEdit={() => onEdit(boundary)}
                    onDelete={() => onDelete(boundary)}
                    onToggleActive={() => onToggleActive(boundary)}
                    isActive={boundary.status === boundaryStatuses.ACTIVE}
                  />
                </TableCell>
              </TableRow>
            ))
            :
            null
          }
        </TableBody>
      </Table>
    </Paper>
  );
}

BoundariesList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  selectedId: PropTypes.number,
  classes: materialClassesType.isRequired,
  onSelectBoundary: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
};

BoundariesList.defaultProps = {
  selectedId: null,
};

export default withStyles(listStyles)(BoundariesList);

