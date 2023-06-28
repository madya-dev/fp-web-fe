import React from 'react';
import { Box, Typography } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" color="textSecondary" gutterBottom>
        Halaman yang Anda cari tidak ditemukan.
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
