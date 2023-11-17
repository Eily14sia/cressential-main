import * as React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function CircularSuccess() {
  return (
    <Box display="flex" alignItems="center" p={2}>      
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1 }}>
        <CheckCircleIcon color="success" fontSize="large" />
      </Box>
    </Box>
  );
}
