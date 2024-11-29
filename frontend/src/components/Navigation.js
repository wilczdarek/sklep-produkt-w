import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sklep Produktów
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Produkty
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Zamówienia
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;