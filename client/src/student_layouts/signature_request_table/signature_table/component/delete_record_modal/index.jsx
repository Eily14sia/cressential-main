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
import MDBox from "../../../../../components/MDBox";
import MDButton from "../../../../../components/MDButton";
import MDTypography from '../../../../../components/MDTypography';



function DialogBox({ open, onClose, onSubmit, recordId, }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Record
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
          <MDTypography variant="body1">
            Are you sure you want to delete Record {recordId}?
          </MDTypography>
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
          color="error"
          onClick={onSubmit} 
        >
            Delete Record
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
