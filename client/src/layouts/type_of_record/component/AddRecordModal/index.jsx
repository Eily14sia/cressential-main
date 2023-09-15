import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";



function DialogBox({ open, onClose, onSubmit, recordType, setRecordType, recordPrice, setRecordPrice, recordTypeError, recordPriceError }) {
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Record
        <IconButton
          sx={{
            position: 'absolute',
            right: '20px',
            top: '8px',
          }}
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }} // Adjust this value to control the opacity level
      />
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center"> 
          <Grid item textAlign="center" xs={11} mb={3}>
            <MDInput
              label="Type of Record"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              required    
              error={!!recordTypeError}
              helperText={recordTypeError}
              sx={{ width: '100%' }}          
            />
          </Grid>
          <Grid item textAlign="center" xs={11} >
            <MDInput
              label="Price"
              type="number"
              value={recordPrice}
              onChange={(e) => setRecordPrice(e.target.value)}
              required
              error={!!recordPriceError}
              helperText={recordPriceError}
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
      <DialogActions>
        <MDButton onClick={onClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="info"
          onClick={onSubmit} 
        >
            Add Record
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
