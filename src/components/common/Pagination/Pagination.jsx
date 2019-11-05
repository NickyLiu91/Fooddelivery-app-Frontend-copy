import React from 'react';
import PropTypes from 'prop-types';

import { TablePagination } from '@material-ui/core';
import { routerHistoryType } from 'types';
import { updateQueryParams } from 'sdk/utils';

function Pagination(props) {
  const {
    rowsPerPage,
    totalRows,
    disabled,
    onChange,
    history,
  } = props;
  let { page } = props;

  const handleChangePage = (event, newPage) => {
    if (!disabled) {
      onChange({ page: newPage, rowsPerPage });
      if (history) {
        history.push(updateQueryParams({ page: newPage }));
      }
    }
  };

  const handleChangeRowsPerPage = event => {
    if (!disabled) {
      const pagesData = {
        rowsPerPage: event.target.value,
        page: event.target.value > totalRows ?
          0 : page,
      };
      onChange(pagesData);
      if (history) {
        history.push(updateQueryParams({ page: pagesData.page }));
      }
    }
  };

  if (page > 0 && totalRows && rowsPerPage >= totalRows) {
    page = 0;
    handleChangePage(null, 0);
  }

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={totalRows}
      rowsPerPage={rowsPerPage}
      page={totalRows ? page : 0}
      backIconButtonProps={{
        'aria-label': 'previous page',
      }}
      nextIconButtonProps={{
        'aria-label': 'next page',
      }}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  history: routerHistoryType,
};

Pagination.defaultProps = {
  disabled: false,
  history: null,
};

export default Pagination;

