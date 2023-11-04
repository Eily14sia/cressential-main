import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>      
        <Box sx={{ display: 'flex' }}>
            <CircularProgress color="info"/>
        </Box>   
    </Box>
   
  );
}