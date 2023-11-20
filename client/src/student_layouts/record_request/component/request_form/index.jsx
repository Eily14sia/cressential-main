import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDAlert from "../../../../components/MDAlert";

// Material Dashboard 2 React example components
import DataTable from "../../../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import DocumentSelection from "../document_selection";
import DialogBox from '../add_record_modal';

import { useMaterialUIController } from "../../../../context";

const index = ( {totalAmount, setTotalAmount, setActiveStep, cartItems, setCartItems, ctrl_number, setCtrlNumber}) => {

    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [data, setData] = useState([]);   
    const [selectedItemID, setSelectedItemID] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [purposeCollege, setPurposeCollege] = useState('');
  
    // =========== For the MDAlert =================
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
  
    const alertContent = (name) => (
      <MDTypography variant="body2" color="white">
        {alertMessage}
      </MDTypography>
    );
  
    // State to track whether the dialog is open
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const jwtToken = localStorage.getItem('token');
    const user_id = parseInt(localStorage.getItem('user_id'));
    
    const [is_alumni, setIsAlumni] = useState('');

    useEffect(() => {
      fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/student-management`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to authenticate token");
          }
          return res.json();
        })
        .then((data) => {
          if (data.length > 0) {
            const filteredData = data.filter((record) => record.user_id === user_id);
            if (filteredData.length > 0) {
              const isAlumniValue = filteredData[0].is_alumni; // Assuming is_alumni is a property of the record
              setIsAlumni(isAlumniValue);
            }
          }
        })
        .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
      fetch("https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to authenticate token");
          }
          return res.json();
        })
        .then((type_of_record) => {   
          if (parseInt(is_alumni) == 1){
            setData(type_of_record);    
          } else {
            const filteredData = type_of_record.filter((record) => record.is_for_alumni === false);
            if (filteredData.length > 0) {
              setData(filteredData);
            } else {
              // Handle case when no records match the condition
              console.log("No records found for non-alumni");
              // You might set some default value or handle this situation accordingly
            }
          }
          
        })
        .catch((err) => console.log(err));
    }, []);

    

    const steps = [
      'Request Form',
      'Payment',
      'Submit',
    ];
  
  
    // Callback function to update the total amount
    const updateSelectedItemID = (newSelectedItemID) => {
      setSelectedItemID(newSelectedItemID);
    };
  
    const columns = [
      { Header: "Type", accessor: "type"},
      { Header: "Price", accessor: "price", align: "center"},
      { Header: "Action", accessor: "action", align: "center"}
    ];

    const [rows, setRows] = useState([]);
  
    useEffect(() => {
      // Calculate the new totalAmount based on the updated cartItems
      const newTotalAmount = cartItems.reduce((total, item) => total + item.price, 0);
      setTotalAmount(newTotalAmount.toFixed(2));
    
      renderCartItems();
    }, [cartItems]);
  
    function removeFromCart(itemId) {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      renderCartItems();
    }
  
  
    function addToCart(id) {
      let quantity = 1;
      let itemExists = false;
  
      // check if item already exists in cart
      for (let i = 0; i < cartItems.length; i++) {
          if (cartItems[i].id === id) {
              itemExists = true;
              cartItems[i].quantity++;
          }
      }
      const type = data.find((item) => item.id === id)?.type;
      const price = data.find((item) => item.id === id)?.price;
  
      // add new item to cart if not already existing
      if (!itemExists) {
          const newItem = {
            id: id,
            type: type,
            price: price,
            quantity: 1,
          };
  
          setCartItems([...cartItems, newItem]);
      }
  
      renderCartItems();
  }
  
  
  
  function renderCartItems() {
    const updatedRows = [];
    let updatedTotalAmount = 0;
  
    for (let i = 0; i < cartItems.length; i++) {
    let item = cartItems[i]; 
    updatedTotalAmount  += item.price;
  
    updatedRows.push({
      type: item.type,
      price: item.price.toFixed(2),
      quantity: item.quantity.toFixed(2),
      action: (
        <>
          <Tooltip title="Remove" >
            <IconButton color="error" onClick={() => removeFromCart(item.id)}>
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </>                                 
      ), 
    });
      
    setTotalAmount(updatedTotalAmount.toFixed(2));
    }
   
    setRows(updatedRows);
  }
  
  // Function to open the dialog
  const handleOpenDialog = () => {
    setIsSuccess(false);
    setIsError(false);
    setIsDialogOpen(true);
  };
  
  // Function to close the dialog
  const handleCloseDialog = () => {
    // setRecordTypeError('');
    // setRecordPriceError('');
    setIsDialogOpen(false);
  };
    

  return (
    <>
        <MDBox pt={2} pb={3} px={5}>
            <Grid container spacing={4}>

                {/* LEFT COLUMN */}                  
                <Grid item lg={6} sm={12}>     

                    {/* REQUEST FOR */}
                    <MDBox                        
                    bgColor={darkMode ? "transparent" : "grey-100"}
                    borderRadius="lg"
                    p={3}
                    mb={1}
                    mt={2}
                    >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{margin:"auto"}}>
                        <MDTypography fontWeight={"bold"}>Request For:</MDTypography>                
                        </Grid>          
                        <DocumentSelection data={data}  updateSelectedItemID={updateSelectedItemID}                      
                        />
                        <Grid item xs={7} >
                        </Grid>
                        <Grid item xs={5} style={{ textAlign: 'right' }} >
                        <MDButton onClick={() => addToCart(selectedItemID)} variant="gradient" color="info">Add Request</MDButton>
                        </Grid>   
                        <Grid item xs={12} >
                        <DataTable table={{ columns, 
                        rows }} entriesPerPage={false} showTotalEntries={false}/>                                          
                        </Grid>
                        
                        
                        <Grid item xs={7} sx={{margin:"auto", textAlign: 'right' }}>
                        <MDTypography variant="body2" fontWeight={"bold"}>Total Amount:</MDTypography>
                        </Grid>
                        <Grid item xs={5}>
                        <MDInput type="number" disabled value={totalAmount} fullWidth/>
                        </Grid>
                    </Grid>
                    </MDBox>
                </Grid>

                {/* RIGHT COLUMN */}
                <Grid item lg={6} sm={12}>                   
                
                    {/* PURPOSE */}
                    <MDBox                        
                    bgColor={darkMode ? "transparent" : "grey-100"}
                    borderRadius="lg"
                    p={3}
                    mb={1}
                    mt={2}
                    >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{margin:"auto"}}>
                        <MDTypography fontWeight={"bold"}>Purpose</MDTypography>                         
                        </Grid>
                        <Grid item xs={12} sx={{margin:"auto"}}>
                        <MDTypography variant="body2">A. Transcript of Records (TOR):</MDTypography>
                        </Grid>
                        <Grid item xs={12} sx={{margin:"auto"}}>
                        <FormGroup sx={{ marginLeft: "30px" }}>
                        <RadioGroup value={selectedPurpose} 
                        onChange={(e) => {setSelectedPurpose(e.target.value), setPurposeCollege("")}}>
                            <FormControlLabel
                            value="Evaluation"
                            control={<Radio />}
                            label="1. Evaluation"
                            />
                            <FormControlLabel
                            value="Employment/Promotion"
                            control={<Radio />}
                            label="2. Employment/Promotion"
                            />
                            <FormControlLabel
                            value="For further studies"
                            control={<Radio />}
                            label="3. For further studies (Specify the college/university)"
                            />
                        </RadioGroup>
                        {selectedPurpose === "For further studies" && (
                            <MDInput
                            type="text"
                            variant="standard"
                            label="Please specify"  
                            onChange={(e) => {setPurposeCollege(" ("+ e.target.value + ")" )}}                             
                            />
                        )}
                        </FormGroup>
                        </Grid>
                        <Grid item xs={3} sx={{marginTop:"15px"}}>
                        <MDTypography variant="body2">B. Others:</MDTypography>
                        </Grid>
                        <Grid item xs={9}>
                        <MDInput onChange={(e) => {setSelectedPurpose(e.target.value), setPurposeCollege("")}} type="text" variant="standard" label="Please specify" fullWidth/>
                        </Grid>
                    </Grid>
                    </MDBox>
                {/* END OF PURPOSE */}

                <Grid container spacing={2}>
                    <Grid item xs={7}></Grid>
                    <Grid item xs={5} sx={{marginTop:"10px"}} >
                        <MDButton variant="gradient" color="info" fullWidth onClick={handleOpenDialog}
                            disabled={selectedPurpose == "" || cartItems.length == 0}>
                            <Icon>arrow_forward</Icon> &nbsp; Next
                        </MDButton>
                    </Grid>
                </Grid>
                <DialogBox
                open={isDialogOpen}
                onClose={handleCloseDialog}
                data={data}
                setData={setData}
                cartItems={cartItems}
                totalAmount={totalAmount}
                selectedPurpose={selectedPurpose}
                purposeCollege={purposeCollege}
                setIsSuccess={setIsSuccess}
                setIsError={setIsError}   
                setAlertMessage={setAlertMessage}
                handleCloseDialog={handleCloseDialog}
                setActiveStep={setActiveStep}
                ctrl_number={ctrl_number}
                setCtrlNumber={setCtrlNumber}
                />              
                </Grid>
            </Grid>
        </MDBox>
    </>
  )
}

export default index