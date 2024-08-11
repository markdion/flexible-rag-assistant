import { Box, Typography } from '@mui/material';
import React from 'react';

const ContextPane: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom>Sources</Typography>
    </Box>
  )
};

export default ContextPane;