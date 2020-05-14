import React from 'react';
import PropTypes from 'prop-types';
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core';
import { updateQueryParams } from 'sdk/utils';
import { routerHistoryType } from 'types';

export default function TableSort(props) {
  const {
    order,
    orderBy,
    onSort,
    disabled,
    cells,
    history,
  } = props;
  const createSortHandler = property => () => {
    const sortOrder = orderBy === property && order === 'asc' ? 'desc' : 'asc';
    onSort({ sortOrder, sortBy: property });
    if (history) {
      history.push({
        search: updateQueryParams({ sortOrder, sortBy: property }),
      });
    }
  };

  return (
    <TableHead>
      <TableRow>
        {cells.map(headCell => (
          <TableCell
            key={headCell.label}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 600 }}
          >
            { headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={order}
                onClick={createSortHandler(headCell.id)}
                disabled={disabled}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableSort.propTypes = {
  onSort: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  cells: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    sort: PropTypes.bool,
  })).isRequired,
  history: routerHistoryType,
};

TableSort.defaultProps = {
  onSort: () => {},
  disabled: false,
  history: null,
};
