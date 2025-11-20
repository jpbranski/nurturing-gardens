'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import {
  getShoppingList,
  removeFromShoppingList,
  updateQuantity,
  updateNotes,
  clearShoppingList,
  downloadShoppingList,
} from '@/lib/shopping-list';
import { ShoppingList } from '@/types/shopping-list';

interface ShoppingListDrawerProps {
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  zone?: string;
}

export default function ShoppingListDrawer({
  open,
  onClose,
  onUpdate,
  zone,
}: ShoppingListDrawerProps) {
  const [list, setList] = useState<ShoppingList>({ items: [], updatedAt: new Date().toISOString() });

  useEffect(() => {
    if (open) {
      setList(getShoppingList());
    }
  }, [open]);

  const handleRemove = (plantId: string) => {
    removeFromShoppingList(plantId);
    setList(getShoppingList());
    onUpdate?.();
  };

  const handleQuantityChange = (plantId: string, quantity: number) => {
    updateQuantity(plantId, quantity);
    setList(getShoppingList());
  };

  const handleNotesChange = (plantId: string, notes: string) => {
    updateNotes(plantId, notes);
    setList(getShoppingList());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire shopping list?')) {
      clearShoppingList();
      setList(getShoppingList());
      onUpdate?.();
    }
  };

  const handleDownload = () => {
    downloadShoppingList(zone);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>
          Shopping List
        </Typography>
        <IconButton onClick={onClose} aria-label="Close shopping list">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {list.items.length === 0 ? (
          <Alert severity="info">
            Your shopping list is empty. Browse plants and add them to your list!
          </Alert>
        ) : (
          <List>
            {list.items.map((item) => (
              <ListItem
                key={item.plantId}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 2,
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.plantName}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(item.plantId)}
                    aria-label={`Remove ${item.plantName} from shopping list`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <TextField
                  label="Quantity"
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.plantId, parseInt(e.target.value) || 1)
                  }
                  inputProps={{ min: 1 }}
                  sx={{ mb: 1 }}
                  fullWidth
                />

                <TextField
                  label="Notes"
                  size="small"
                  multiline
                  rows={2}
                  value={item.notes || ''}
                  onChange={(e) => handleNotesChange(item.plantId, e.target.value)}
                  placeholder="Add notes (optional)"
                  fullWidth
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {list.items.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              fullWidth
            >
              Export as Text File
            </Button>
            <Button variant="outlined" color="error" onClick={handleClearAll} fullWidth>
              Clear All
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
}
