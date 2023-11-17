import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useNavigate} from "react-router-dom";
import { Link } from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "../../../../../components/MDBox";
import MDButton from "../../../../../components/MDButton";
import MDAlert from "../../../../../components/MDAlert";
import MDTypography from '../../../../../components/MDTypography';
import CircularProgress from '../../../../../examples/CircularProgress';
import CircularSuccess from '../../../../../examples/CircularSuccess';
import CircularError from '../../../../../examples/CircularError';
import illustration from "../../../../../assets/images/illustrations/business-task-list.svg"

function DialogBox({ open, onDialogClose, isSuccess, isError, setIsSuccess, setIsError, alertMessage, alertContent, isLoading, setIsLoadingDialogOpen}) {
  return (
    <Dialog open={open} onClose={onDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <IconButton
          sx={{
            position: 'absolute',
            right: '20px',
            top: '18px',
          }}
          edge="end"
          color="inherit"
          onClick={onDialogClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{minHeight: '30vh'}}>
        <Grid container justifyContent="center" mt={2} alignItems="center">
         
            {isLoading && (
              <>
                <CircularProgress/>
                <Grid container spacing={1} justifyContent="center" alignItems="center">                    
                            
                  <Grid item xs={10} sx={{textAlign: "center"}}>
                    <MDTypography variant="h3" mt={2} color="info" textGradient >Processing Request</MDTypography>     
                  </Grid>  
                  <Grid item xs={10} mb={5} sx={{textAlign: "center"}}>
                    <MDTypography variant="body2" mt={3}>
                    Retrieving data from the blockchain. This process may take a minute or longer. Please wait.
                    </MDTypography>           
                  </Grid>   
                </Grid>
              </>
            )}
            {isSuccess && (
              <>
                <CircularSuccess/>
                <Grid container spacing={1} justifyContent="center" alignItems="center">                    
                            
                  <Grid item xs={10} sx={{textAlign: "center"}}>
                    <MDTypography variant="body1" color="dark" textGradient fontWeight="regular">Verification Successful </MDTypography>     
                  </Grid>  
                  <Grid item xs={10} mb={3} sx={{textAlign: "center"}}>
                    <MDTypography variant="h4" mt={2} color="success" textGradient >
                      {alertMessage} 
                    </MDTypography>     
                  </Grid> 
                </Grid>
              </>
            )}
            {isError && (
              <>
                <CircularError/>
                <Grid container spacing={1} justifyContent="center" alignItems="center">                    
                            
                  <Grid item xs={10} sx={{textAlign: "center"}}>
                    <MDTypography variant="body1" color="dark" fontWeight="regular">Verification Warning </MDTypography>     
                  </Grid>  
                  <Grid item xs={10} mb={3} sx={{textAlign: "center"}}>
                    <MDTypography variant="h5" mt={2} color="error" textGradient >
                      {alertMessage} 
                    </MDTypography>              
                  </Grid>   
                </Grid>
              </>
            )}
          
        </Grid>
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
    </Dialog>
  );
}

export default DialogBox;
