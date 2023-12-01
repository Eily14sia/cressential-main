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
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from '../../../../components/MDTypography';
import CircularProgress from '../../../../examples/CircularProgress';
import illustration from "../../../../assets/images/illustrations/business-task-list.svg"

function DialogBox({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      
      <MDBox
        mt={3}
        sx={{ opacity: 0.2 }} // Adjust this value to control the opacity level
      />
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center"> 
        
          <CircularProgress/>
          <Grid container spacing={1} justifyContent="center" alignItems="center">                    
                      
            <Grid item xs={10} sx={{textAlign: "center"}}>
              <MDTypography variant="h3" mt={2} color="info" textGradient >Processing Request</MDTypography>     
            </Grid>  
            <Grid item xs={10} mb={5} sx={{textAlign: "center"}}>
              <MDTypography variant="body2" mt={3}>
              The request is being submitted. This process may take a minute or less. Please wait.
              </MDTypography>           
            </Grid>      
                                   
                     
            </Grid>
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
