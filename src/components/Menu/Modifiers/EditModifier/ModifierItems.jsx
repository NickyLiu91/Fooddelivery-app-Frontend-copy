import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  Grid,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { materialClassesType } from 'types';
import AlertDialog from 'components/common/AlertDialog/AlertDialog';
import ModifiersService from 'services/modifiersService';
import { Loader } from 'components/common';
import { modifiersService, notifyService } from 'services';
import { getErrorMessage } from 'sdk/utils';

function ModifierItems({
  classes,
  modifierId,
}) {
  const [items, setItems] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [itemsLoading, setItemsLoading] = useState([]);
  const [checked, setChecked] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(false);
  console.log('modifierId', modifierId);

  const getMenuItems = useCallback(
    async () => {
      setItemsLoading(true);
      try {
        const data = await ModifiersService.getMenuItems(modifierId);
        setItems(data.result);
      } catch (error) {
        console.log('[getMenuItems] error', error);
        notifyService.showError(getErrorMessage(error));
      } finally {
        setItemsLoading(false);
      }
    },
    [modifierId],
  );

  useEffect(() => {
    getMenuItems();
  }, [getMenuItems]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const filteritemsList = () => {
    const itemsToDelete = itemToDelete ? [itemToDelete.id] : checked;
    return items.filter(item => itemsToDelete.includes(item.id)).map(item => +item.id);
  };

  const handleConfirm = async (confirm) => {
    if (!confirm) {
      setConfirmOpen(false);
      if (itemToDelete) setItemToDelete(null);
    } else {
      setDeleting(true);
      try {
        await modifiersService.deleteMenuItems(modifierId, filteritemsList());
        notifyService.showInfo('Items successfully deleted');
        setConfirmOpen(false);
        setItemToDelete(null);
        setChecked([]);
        getMenuItems();
      } catch (error) {
        console.log('[delteMenuItems] error', error);
        notifyService.showError(getErrorMessage(error));
      } finally {
        setDeleting(false);
      }
      // onSubmit(filteritemsList());
    }
  };

  if (itemsLoading) return <Loader />;

  return (
    <Box mt={2}>
      {
        checked.length ?
          <Grid container>
            <Typography component="span">
              {`${checked.length} item${checked.length === 1 ? '' : 's'} selected`}
              <Button
                onClick={() => setConfirmOpen(true)}
                color="secondary"
              >
                Remove modifier from items
              </Button>
            </Typography>
          </Grid>
          :
          <Typography>
            {items.length ? `${items.length} item${items.length === 1 ? '' : 's'}` : 'No Items'}
          </Typography>
      }
      <Box mt={2}>
        {
          items.length !== 0 &&
          <Paper>
            <List className={classes.itemsList}>
              {items.map(item => {
                const labelId = `checkbox-list-label-${item.id}`;

                return (
                  <React.Fragment key={item.id}>
                    <ListItem
                      key={item.id}
                      role={undefined}
                      button
                      onClick={handleToggle(item.id)}
                      className={classes.listItem}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(item.id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={item.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => {
                            setItemToDelete(item);
                            setConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        }
      </Box>
      <AlertDialog
        isSubmitting={deleting}
        isOpen={confirmOpen}
        onClose={() => handleConfirm(false)}
        onConfirm={() => handleConfirm(true)}
        title={`Delete item${!itemToDelete ? 's' : ''}`}
        message={`Do you really want to delete ${itemToDelete ? itemToDelete.name : 'items'} from list?`}

      />
    </Box>
  );
}

ModifierItems.propTypes = {
  classes: materialClassesType.isRequired,
  modifierId: PropTypes.string.isRequired,
};

export default ModifierItems;

