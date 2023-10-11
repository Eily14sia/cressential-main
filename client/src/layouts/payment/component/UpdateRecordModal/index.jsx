import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from "../../../../components/MDTypography";



function DialogBox({ open, onClose, onSubmit, payment_id, payment_date, payment_method, 
  setPaymentID, setPaymentDate, setPaymentMethod, setPaymentStatus, payment_status, ctrl_number, }) {
  
    // Create a new Date object from the date string
    const parsedDate = new Date(payment_date);

    // Extract date components (month, day, and year)
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const year = parsedDate.getFullYear();
  
    // Format the date to the desired format (MM/dd/yyyy)
    const new_date = `${year}-${month}-${day}`;
    const today = new Date();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Record
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
          
          <Grid item textAlign="center" xs={12} mb={2}>
            
            <Grid item>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  CTRL-{ctrl_number}
                </MDTypography>
                
              </MDBox>
            </Grid>
          </Grid>
          
          <Grid item textAlign="center" xs={11} mb={2}>
            <MDInput
              label="Payment ID"
              type="text"
              value={payment_id}
              onChange={(e) => setPaymentID(e.target.value)}
              required
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item textAlign="center" xs={11} >
            <MDInput
              label="Payment Date"
              type="date"
              value={payment_date ? new_date : today}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item textAlign="left" xs={11} >
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Payment Method</InputLabel>
              <Select
                style={{ height: "42px" }}
                value={payment_method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Select an option"
              >
                <MenuItem value="gcash">GCash</MenuItem>
                <MenuItem value="paymaya">Maya</MenuItem>
                <MenuItem value="dob">Online Banking</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </Select>
            </FormControl>            
          </Grid>          
          <Grid item textAlign="left" xs={11} mb={1} >
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Request Status</InputLabel>
              <Select
                style={{ height: "42px" }}
                value={payment_status}
                onChange={(e) => setPaymentStatus(e.target.value)}
                label="Select an option"
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </Select>
            </FormControl>            
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
            Update Record
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
