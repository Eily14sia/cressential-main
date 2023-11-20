import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDAlert from "../../components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import regeneratorRuntime from "regenerator-runtime";
import AddDialogBox from './component/AddRecordModal';
import UpdateDialogBox from './component/UpdateRecordModal';
import DeleteDialogBox from './component/DeleteRecordModal';
import CircularProgress from '../../examples/CircularProgress';

function Type_of_Record() {
  const jwtToken = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);

// =========== For the MDAlert =================
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      {alertMessage}
    </MDTypography>
  );
  
  // =========== For the datatable =================
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record`, {
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
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  

  const columns = [
    { Header: "id", accessor: "id", width: "10%" },
    { Header: "type", accessor: "type"},
    { Header: "price", accessor: "price", align: "center"},
    { Header: "action", accessor: "action", align: "center"}
  ];

/* =========================================
                   ADD RECORD
   =========================================*/
  
  // State to track whether the dialog is open
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for form inputs
  const [recordType, setRecordType] = useState('');
  const [recordPrice, setRecordPrice] = useState('');
  const [recordTypeError, setRecordTypeError] = useState('');
  const [recordPriceError, setRecordPriceError] = useState('');
  const [recordId, setRecordId] = useState('');

  const validateInputs = () => {
    let valid = true;

    if (!recordType) {
      setRecordTypeError('Record type is required');
      valid = false;
    } else {
      setRecordTypeError('');
    }

    if (!recordPrice) {
      setRecordPriceError('Record price is required');
      valid = false;
    } else {
      setRecordPriceError('');
    }

    return valid;
  };

  // Function to open the dialog
   const handleOpenDialog = () => {
    setIsSuccess(false);
    setIsError(false);
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setRecordTypeError('');
    setRecordPriceError('');
    setIsDialogOpen(false);
  };

  // Function to handle add record form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a new record object to send to the server
    const newRecord = {
      type: recordType,
      price: recordPrice,
    };

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch('https://cressential-5435c63fb5d8.herokuapp.com/mysql/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        handleCloseDialog();
        setIsSuccess(true);
        setAlertMessage('Record added successfully.');

        // Fetch updated data and update the state
        fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record`, {
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
          .then((fetchedData) => {
            setData(fetchedData);
          })
          .catch((err) => console.log(err));
      } else {
        setAlertMessage('Failed to update record');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  };

/* =========================================
               UPDATE RECORD
   ========================================= */

  // State to track whether the dialog is open
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // State for form inputs
  const [recordUpdateType, setUpdateRecordType] = useState('');
  const [recordUpdatePrice, setUpdateRecordPrice] = useState('');

  // Function to open the dialog
  const handleOpenUpdateDialog = (recordId, recordType, recordPrice) => {
    setIsSuccess(false);
    setIsError(false);
    setUpdateRecordType(recordType); // Reset other form fields 
    setUpdateRecordPrice(recordPrice);
    setRecordId(recordId); // Set the recordId state
    setIsUpdateDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  // Function to handle update record form submission
  const handleUpdateSubmit = async (event, recordId, ) => {
    event.preventDefault();
    // Create an updated record object to send to the server
    const updatedRecord = {
      type: recordUpdateType,
      price: recordUpdatePrice,
    };

  try {
    const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-record/${recordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedRecord),
    });

    if (response.ok) {
      handleCloseUpdateDialog();
      setIsSuccess(true);
      setAlertMessage('Record updated successfully.');

      // Fetch updated data and update the state
      fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record`, {
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
          .then((fetchedData) => {
            setData(fetchedData);
          })
          .catch((err) => console.log(err));
    } else {
      setAlertMessage('Failed to update record');
    }
  } catch (error) {
    setIsError(true);
    console.error('Error:', error);
  }
};

/* =========================================
               DELETE RECORD
   ========================================= */

  // State to track whether the dialog is open
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State for form inputs
  const [recordDeleteType, setDeleteRecordType] = useState('');
  const [recordDeletePrice, setDeleteRecordPrice] = useState('');

  // Function to open the dialog
  const handleOpenDeleteDialog = (recordId, recordType, recordPrice) => {
    setIsSuccess(false);
    setIsError(false);
    setDeleteRecordType(recordType); // Reset other form fields 
    setDeleteRecordPrice(recordPrice);
    setRecordId(recordId); // Set the recordId state
    setIsDeleteDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  // Function to handle delete record form submission
  const handleDeleteSubmit = async (event, recordId, ) => {
    event.preventDefault();
    // Create an deleted record object to send to the server
    const deletedRecord = {
      type: recordDeleteType,
      price: recordDeletePrice,
    };

  try {
    const response = await fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/delete-record/${recordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(deletedRecord),
    });

    if (response.ok) {
      handleCloseDeleteDialog();
      setIsSuccess(true);
      setAlertMessage('Record deleted successfully.');

      // Fetch deleted data and delete the state
      fetch(`https://cressential-5435c63fb5d8.herokuapp.com/mysql/type-of-record`, {
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
          .then((fetchedData) => {
            setData(fetchedData);
          })
          .catch((err) => console.log(err));
    } else {
      setAlertMessage('Failed to delete record');
    }
  } catch (error) {
    setIsError(true);
    console.error('Error:', error);
  }
};


  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {isSuccess && (
                <MDAlert color="success" dismissible sx={{marginBottom: '50px'}} onClose={() => setIsSuccess(false)}>
                      {alertContent("success", alertMessage)}
                </MDAlert>
              )}
              {isError && (
                <MDAlert color="error" dismissible sx={{marginBottom: '50px'}} onClose={() => setIsError(false)}>
                  {alertContent("error", alertMessage)}
                </MDAlert>
              )}
              <Card>            
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Type of Record Table
                  </MDTypography>
                  
                  <MDButton variant="gradient" color="dark" onClick={handleOpenDialog}>
                    Add Record&nbsp;
                    <Icon>add</Icon>
                  </MDButton>
                  <AddDialogBox
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSubmit={(event) => handleSubmit(event)}
                    recordType={recordType}
                    setRecordType={setRecordType}
                    recordPrice={recordPrice}
                    setRecordPrice={setRecordPrice}
                    recordTypeError={recordTypeError}
                    recordPriceError={recordPriceError}
                  />
                </MDBox>

                <MDBox pt={3}>
                  {loading && (<CircularProgress/>)}
                  <DataTable table={{ columns, 
                  rows: data.map((item) => ({
                    id: item.id,
                    type: item.type,
                    price: item.price,
                    action: (
                      <>
                        <Tooltip title="Update" >
                          <IconButton color="info" onClick={() => handleOpenUpdateDialog(item.id, item.type, item.price)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" >
                          <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>                                 
                    ), 
                    })), 
                  }} canSearch={true} />
                  <UpdateDialogBox
                    open={isUpdateDialogOpen}
                    onClose={handleCloseUpdateDialog}
                    onSubmit={(event) => handleUpdateSubmit(event, recordId)}
                    recordType={recordUpdateType}
                    setRecordType={setUpdateRecordType}
                    recordPrice={recordUpdatePrice}
                    setRecordPrice={setUpdateRecordPrice}   
                    recordId={recordId}                 
                  />
                  <DeleteDialogBox
                    open={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    onSubmit={(event) => handleDeleteSubmit(event, recordId)}                      
                    recordId={recordId}                 
                  />
                </MDBox>
              </Card>
            </Grid>
            
          </Grid>
        </MDBox>
      <Footer />
  </DashboardLayout>
  );
}

export default Type_of_Record;
