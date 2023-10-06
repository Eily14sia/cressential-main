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
import MDTypography from '../../../../components/MDTypography';



function DialogBox({ open, onClose, setData, ctrl_number, setIsSuccess, setIsError, setAlertMessage, }) {

  // Retrieve the user_role from localStorage
  const user_id = localStorage.getItem('user_id');
                       
  // Function to handle cancel record form submission
  const handleCancelSubmit = async (event, new_ctrl_number) => {
    event.preventDefault();
    // Create an canceld record object to send to the server
    try {
      const response = await fetch(`http://localhost:8081/mysql/cancel-record-request/${new_ctrl_number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onClose();
        setIsSuccess(true);
        setAlertMessage('Request cancelled successfully.');

        // Fetch updated data and update the state
        fetch(`http://localhost:8081/mysql/student-record-request/${user_id}`)
          .then((res) => res.json())
          .then((data) => {
            setData(data); // Set the fetched data into the state
          })
          .catch((err) => console.log(err));
      } else {
        setAlertMessage('Failed to cancel request');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cancel Request
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
          <MDTypography variant="body1" textAlign="center">
            Are you sure you want to cancel request <b>CTRL-{ctrl_number}</b>?
          </MDTypography>
        </Grid>
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
      <DialogActions>
        <MDButton
          variant="contained"
          color="error"
          onClick={(event) => handleCancelSubmit(event, ctrl_number)}
        >
            Cancel Request
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
