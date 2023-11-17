import * as React from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function CircularSuccess() {
  return (
    <Box display="flex" alignItems="center" p={2}>      
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1 }}>
        <HighlightOffIcon color="error" fontSize="large" />
      </Box>
    </Box>
  );
}
