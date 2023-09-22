import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from '../../../../components/MDTypography';



function DialogBox({ open, onClose, cartItems, totalAmount, onSubmit, selectedPurpose, purposeCollege, recordType, setRecordType, recordPrice, setRecordPrice, recordTypeError, recordPriceError }) {


  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirmation
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
      <MDBox
          p={3}
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
          shadow="md"
          color="light"
          bgColor="secondary"
          variant="gradient"
        >
          <MDTypography variant="body2" color="white">You are requesting for the following document/s:</MDTypography>           
          
          <MDBox ml={5}>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} >
                <MDTypography variant="body2" fontWeight="medium" color="white">
                  {item.type}
                </MDTypography>
              </li>
            ))}
          </ul>
          </MDBox>
          <MDTypography variant="body2" mt={2} color="white"> Purpose: 
          <MDTypography variant="body2" fontWeight="medium" color="white"> {selectedPurpose + " " + purposeCollege} </MDTypography> 
          </MDTypography> 
          
          <MDTypography variant="body2" mt={2}color="white"> Total Amount: </MDTypography> 
          <MDTypography variant="body2" fontWeight="medium" color="white"> Php {totalAmount}</MDTypography> 
          
          
        </MDBox>
        <MDBox mt={5} mb={2} px={1} textAlign="left" sx={{ lineHeight: '1' }} >
          <MDTypography variant="caption" color="error" > 
              <b>Note:</b> We only accept cashless payments through e-wallets like GCash and Paymaya, as well as online banking via Union Bank and BPI.
          </MDTypography> 
        </MDBox>
       
        
      </DialogContent>
      <MDBox
        component="hr"
        sx={{ opacity: 0.2 }}
      />
      <DialogActions>
        <MDButton variant="text" onClick={onClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="info"
          onClick={onSubmit} 
        >
            <Icon>send</Icon> &nbsp; Submit
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default DialogBox;
