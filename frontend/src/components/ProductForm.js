import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box
} from '@mui/material';
import { CATEGORIES, STATUS_OPTIONS } from '../constants';

const ProductForm = ({ open, handleClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Elektronika', // domyślna wartość
    quantity: '',
    status: 'dostępny'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset formularza dla nowego produktu
      setFormData({
        name: '',
        category: 'Elektronika',
        quantity: '',
        status: 'dostępny'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edytuj Produkt' : 'Dodaj Nowy Produkt'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Nazwa Produktu"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <TextField
              name="category"
              label="Kategoria"
              select
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="quantity"
              label="Ilość"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />

            <TextField
              name="status"
              label="Status"
              select
              value={formData.status}
              onChange={handleChange}
              required
              fullWidth
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Zapisz' : 'Dodaj'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;