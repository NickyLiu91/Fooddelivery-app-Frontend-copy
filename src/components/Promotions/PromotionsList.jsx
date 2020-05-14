import React, { useState, useEffect } from 'react';
import moment from 'moment';

import DefaultLayout from 'components/Layouts/DefaultLayout';
import {
  Typography,
  Container,
  Grid,
  Button,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { Loader, AlertDialog } from 'components/common';
import { notifyService, PromotionsService } from 'services';
import { getErrorMessage } from 'sdk/utils';
import { routerHistoryType } from 'types';
import ROUTES from 'constants/routes';
import { TIME_OUTPUT_FORMAT, TIME_PATTERN } from 'constants/promotions';

const propTypes = {
  history: routerHistoryType.isRequired,
};

function PromotionsList({ history }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePromoId, setDeletePromoId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function getPromotions() {
    try {
      setLoading(true);
      const promotions = await PromotionsService.getPromotions();
      setList(promotions.result);
    } catch (error) {
      console.log('[getPromotions] error', error);
      notifyService.showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPromotions();
  }, []);

  async function handleDeleteConfirm() {
    try {
      setDeleting(true);
      await PromotionsService.deletePromotion(deletePromoId);
      setDeletePromoId(null);
      notifyService.showInfo('Promotion is successfully deleted.');
      getPromotions();
    } catch (error) {
      console.log('[handleDeleteConfirm] error', error);
      notifyService.showError(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit(promo) {
    history.push({
      pathname: `${ROUTES.PROMOTIONS}/${promo.id}/edit`,
    });
  }

  function handleAdd() {
    history.push({
      pathname: `${ROUTES.PROMOTIONS}/add`,
    });
  }

  async function toggleActive(promo) {
    if (promo.end_date && moment(promo.end_date).isBefore(moment())) {
      history.push({
        pathname: `${ROUTES.PROMOTIONS}/${promo.id}/edit`,
        state: { endDateInPast: true },
      });
      return;
    }
    try {
      setLoading(true);
      const newPromo = { ...promo };
      const { id } = newPromo;
      delete newPromo.id;
      delete newPromo.created_at;
      delete newPromo.updated_at;
      delete newPromo.restaurant;
      if (promo.free_menu_item) newPromo.free_menu_item = promo.free_menu_item.id;
      await PromotionsService.updatePromotion(id, { ...newPromo, status: !newPromo.status });
      notifyService.showInfo('Promotion is successfully updated.');
      getPromotions();
    } catch (error) {
      setLoading(false);
      console.log('[handleDeleteConfirm] error', error);
      notifyService.showError(getErrorMessage(error));
    }
  }

  return (
    <DefaultLayout>
      <Container>
        <Grid container justify="space-between">
          <Typography variant="h4">
            Promotions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            disabled={list && list.length > 9}
            onClick={() => handleAdd()}
          >
            Add promotion
          </Button>
        </Grid>
        <Box mt={2}>
          {
          loading ?
            <Loader /> :
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Promotion period</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map(promotion => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        {promotion.name}
                      </TableCell>
                      <TableCell align="right">
                        <Typography>
                          {promotion.end_date ? `${promotion.start_date} - ${promotion.end_date}` : `From ${promotion.start_date}` }
                        </Typography>
                        <Typography>
                          {promotion.end_time ?
                            `${moment(promotion.start_time, TIME_PATTERN).format(TIME_OUTPUT_FORMAT)} - ${moment(promotion.end_time, TIME_PATTERN).format(TIME_OUTPUT_FORMAT)}` :
                            `From ${moment(promotion.start_time, TIME_PATTERN).format(TIME_OUTPUT_FORMAT)}` }
                        </Typography>
                        <Typography>
                          {promotion.week_days && Object.keys(promotion.week_days)
                            .filter(day => promotion.week_days[day])
                            .map(day => day.charAt(0).toUpperCase() + day.slice(1))
                            .join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          color={promotion.status ? 'primary' : 'default'}
                          label={promotion.status ? 'Active' : 'Inactive'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box component="span" mr={1}>
                          <Button
                            size="small"
                            style={{ textTransform: 'none' }}
                            variant="outlined"
                            onClick={() => toggleActive(promotion)}
                          >
                            {promotion.status ? 'Inactivate' : 'Activate'}
                          </Button>
                        </Box>
                        <IconButton
                          onClick={() => handleEdit(promotion)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeletePromoId(promotion.id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          }
        </Box>
      </Container>
      <AlertDialog
        isOpen={!!deletePromoId}
        onClose={() => setDeletePromoId(null)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={deleting}
        title="Delete Promotion"
        message="Do you really want to delete promotion ? This action can not be undone."
      />
    </DefaultLayout>
  );
}

PromotionsList.propTypes = propTypes;

export default PromotionsList;
