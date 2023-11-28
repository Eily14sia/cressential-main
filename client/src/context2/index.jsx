import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize with null for logged out state
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);  
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    const loginRecord = {
      email: email,
      password: password,
    };
    
    if (!email || !password){
      setIsError(true);
      const isEmailNull = "Email is required.";
      const isPasswordNull = "Password is required."
      setAlertMessage(!email ? isEmailNull : isPasswordNull);
    } else {
      try {
        // Make an authentication request to your server or API
        const response = await fetch('https://cressential-5435c63fb5d8.herokuapp.com/mysql/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginRecord }),
        });
    
        if (response.ok) {
        const data = await response.json();
        const token = data.token; // Assuming the token is returned from the server
        const user = data.user;

        // Extract user_role from the user object
        const user_role = user ? user.role : null;
        const user_id = user? user.user_id : null;
        const user_status = user? user.status : null;
       
        
        // Redirect the user to the dashboard or perform other actions
        console.log('Login successful');
        if (user_status === 'active'){
          localStorage.setItem('user_role', user_role);
          localStorage.setItem('user_id', user_id);
  
          // Save the token in localStorage or sessionStorage
          localStorage.setItem('token', token);
          parseInt(user_role) === 1 ? navigate('/dashboard') : navigate('/student-request-table');
        } else {
          setIsError(true);
          setAlertMessage('Login failed. Your account is inactive.');
        }


        } else {
        // Authentication failed
        // You can display an error message to the user
        console.error('Login failed');
        setIsError(true);
        setAlertMessage('Login failed. Incorrect credentials.');
        }
      } catch (error) {
          console.error('Error:', error);
      }
    }
    setPassword('');
    setEmail('');
  };

  async function connectWallet() {
    
    setIsSuccess(false);
    setIsError(false);
    setAlertMessage("");

    // Check if MetaMask is available
    if (window.ethereum) {
      // Access the MetaMask Ethereum provider
      const ethereum = window.ethereum;
  
      try {
        // Request permission to access the user's accounts
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
        // Get the selected account's address
        const account = accounts[0]; // Assuming the user selects the first account
  
        // Do something with the wallet address (e.g., store it in state)
        setWalletAddress(account);
        console.log(account);
        await login_metamask(account);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      setIsError(true);
      setAlertMessage('MetaMask is not available in this browser. Please use the default login through email and password.');
    }
  }

// Define a function to handle form submission
    const login_metamask = async (wallet_address) => {
        try {
            // Make an authentication request to your server or API
            const response = await fetch('https://cressential-5435c63fb5d8.herokuapp.com/mysql/login-metamask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ wallet_address }),
            });
        
            if (response.ok) {
            const data = await response.json();
            const token = data.token; // Assuming the token is returned from the server
            const user = data.user;

            /// Extract user_role from the user object
          const user_role = user ? user.role : null;
          const user_id = user? user.user_id : null;
          const user_status = user? user.status : null;
        
          
          // Redirect the user to the dashboard or perform other actions
          console.log('Login successful');
          if (user_status === 'active'){
            localStorage.setItem('user_role', user_role);
            localStorage.setItem('user_id', user_id);
    
            // Save the token in localStorage or sessionStorage
            localStorage.setItem('token', token);
            parseInt(user_role) === 1 ? navigate('/dashboard') : navigate('/student-request-table');
          } else {
            setIsError(true);
            setAlertMessage('Login failed. Your account is inactive.');
          }


          } else {
          // Authentication failed
          // You can display an error message to the user
          console.error('Login failed');
          setIsError(true);
          setAlertMessage('Wallet Address not found. Ensure that correct account is connected in your MetaMask.');
          }
        } catch (error) {
            console.error('Error:', error);
        }
        setPassword('');
        setEmail('');
  };

  // Define a function for logging out
  const logout = () => {
    // Clear the user-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');

    // Redirect the user to the login page or perform other actions
    // Example: Redirect to the login page
    navigate('/');
  };

  //   /* ================= Emails ===================== */

  // // ================ For the Data =======================
  // const [request_data, setRequestData] = useState([]);
  // const [issuance_data, setIssuanceData] = useState([]);
  // const [student_data, setStudentData] = useState([]);
  // const [type_of_record, setTypeOfRecord] = useState([]);
  // const jwtToken = localStorage.getItem('token');
  // /* ================= Alumni Record Request ===================== */

  // useEffect(() => {
  //   const fetchData = async (url, setDataCallback) => {
  //     try {
  //       const response = await fetch(url, {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to authenticate token");
  //       }

  //       const data = await response.json();
  //       setDataCallback(data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchData("http://localhost:8081/mysql/email/record-request", setRequestData);
  //   fetchData("http://localhost:8081/mysql/email/record-issuance", setIssuanceData);
  //   fetchData("http://localhost:8081/mysql/student-management", setStudentData);
  //   fetchData("http://localhost:8081/mysql/type-of-record", setTypeOfRecord);
  
  // }, []);  

  // function getStudentEmail(student_id) {  
  //   const email = student_data.find((item) => item.id == student_id).email;
  //   return email;
  // }

  // function getRecordType(type_id) {  
  //   const type = type_of_record.find((item) => item.id == type_id).type;
  //   return type;
  // }
    
  // const sendReminderEmail = async (toEmail, ctrlNumber, totalAmount) => {

  //   const today = new Date();
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);
  //   const formattedDate = tomorrow.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });

  //   const emailData = {
  //     to: toEmail,
  //     subject: 'Urgent: Payment Deadline Tomorrow for Your Record Request',
  //     text: `
  //     Good day!
  
  //     This is to remind you that your pending record request payment is due by tomorrow at 12:00 AM.
  
  //     Failure to make the payment by the specified deadline will result in the automatic cancellation of your request.
  
  //       • Record Request: Ctrl-${ctrlNumber}
  //       • Payment Deadline: ${formattedDate}, 12:00 AM
  //       • Payment Amount: Php ${totalAmount}.00
  //       • Payment Method: GCash/Maya/Online Banking
  
  //     To complete your payment, please follow these steps:

  //       1. Log in to our system: https://cressential-5435c63fb5d8.herokuapp.com
  //       2. Navigate to the "Request Table" section.
  //       3. Select your record request and click the "Pay now" Button.
  //       4. Proceed with the payment process.
  
  //     If you have already made the payment, please disregard this message. For any questions or assistance with your payment, please contact our office.
  
  //     Thank you for your prompt attention to this matter.
  
  //     Sincerely,
  //     Registrar's Office
  //     `,
  //   };
  
  //   try {
  //     const response = await axios.post('http://localhost:8081/emails/send-email', emailData);
  //     if (response.status === 200) {
  //       console.log('Email sent successfully.');

        
  //       const apiUrl = `http://localhost:8081/mysql/payment/update-record/notify/${ctrlNumber}`;
  //       try {
  //         const response = await axios.put(apiUrl, {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${jwtToken}`,
  //           },
  //         });
        
  //         if (response.status === 200) {
  //           console.log('Successfully updated the payment:', response.data);
  //           // Handle success here
  //         } else {
  //           console.error('Error:', response.statusText);
  //           // Handle error here
  //         }
  //       } catch (error) {
  //         console.error('An error occurred:', error);
  //         // Handle the error
  //       }

  //     } else {
  //       console.error('Failed to send email.');
  //     }
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // };
  
  // const sendCancelationEmail = async (toEmail, ctrlNumber) => {

  //   const emailData = {
  //     to: toEmail,
  //     subject: 'Urgent: Cancellation of Your Record Request',
  //     text: `
  //     Good day!
  
  //     This is to inform you that your pending record request with control number Ctrl-${ctrlNumber} has been canceled due to the failure to make the required payment within the specified deadline.
  
  //     Failure to make the payment by the specified deadline will result in the automatic cancellation of your request.
  
  //     We understand that circumstances may have caused the delay in payment, and we regret that your request had to be canceled. If you still wish to obtain your academic record, please reinitiate the request through our system and complete the payment.

  //     If you have any questions or need assistance, please feel free to contact our office.

  //     Thank you for your understanding.
  
  //     Sincerely,
  //     Registrar's Office
  //     `,
  //   };

  //   try {
  //     const response = await axios.post('http://localhost:8081/emails/send-email', emailData);
  //     if (response.status === 200) {
  //       console.log('Email sent successfully.');
  //     } else {
  //       console.error('Failed to send email.');
  //     }
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }

  // };


  // const sendNotifEmail = async (toEmail, recordType, ipfs, dateIssued) => {

  //   const date_issued= new Date(dateIssued);
  //   date_issued.setDate(date_issued.getDate() + 365);
  //   const formattedDate = date_issued.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });

  //   const emailData = {
  //     to: toEmail,
  //     subject: 'Important Reminder: Your Record is Expiring Next Month',
  //     text: `
  //     Good day!
  
  //     This is a friendly reminder that your record with the following information is set to expire on ${formattedDate}.

  //       • Record Type: ${recordType}
  //       • IPFS Link: https://cressential-5435c63fb5d8.herokuapp.com/ipfs/${ipfs}
  //       • Expiration Date: ${formattedDate}

  //     To maintain access to your records, you can submit a new record request. You can easily do this by following these steps:

  //       1. Visit our online portal: https://cressential-5435c63fb5d8.herokuapp.com
  //       2. Click on the "Record Request" tab.
  //       3. Fill out the required information.
  //       4. Review your request carefully and submit it.
  //       5. Proceed to payment process.

  //     For any questions or assistance with renewing your record, please don't hesitate to contact our office.

  //     Thank you for your cooperation.

  //     Sincerely,
  //     Registrar's Office
  //     `,
  //   };
  
  //   try {
  //     const response = await axios.post('http://localhost:8081/emails/send-email', emailData);
  //     if (response.status === 200) {
  //       console.log('Email sent successfully.');

  //     } else {
  //       console.error('Failed to send email.');
  //     }
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // };

  // const sendExpirationEmail = async (toEmail, recordType, ipfs, dateIssued) => {

  //   const date_issued= new Date(dateIssued);
  //   date_issued.setDate(date_issued.getDate() + 365);
  //   const formattedDate = date_issued.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });

  //   const emailData = {
  //     to: toEmail,
  //     subject: 'Important Notice: Your Record Has Expired',
  //     text: `
  //     Good day!
  
  //     We regret to inform you that your record with the following information has expired on ${formattedDate}.

  //       • Record Type: ${recordType}
  //       • IPFS Link: https://cressential-5435c63fb5d8.herokuapp.com/ipfs/${ipfs}
  //       • Expiration Date: ${formattedDate}

  //     Your record may no longer be valid for use. To regain access to your record, you will need to submit a new record request. Please note that the process of submitting a new request may take some time to complete.

  //     To submit a new record request, please follow these steps:

  //       1. Visit our online portal: https://cressential-5435c63fb5d8.herokuapp.com
  //       2. Click on the "Record Request" tab.
  //       3. Fill out the required information.
  //       4. Review your request carefully and submit it.
  //       5. Proceed to payment process.

  //     We apologize for any inconvenience this may cause. We appreciate your understanding and cooperation.

  //     Sincerely,
  //     Registrar's Office
  //     `,
  //   };
  
  //   try {
  //     const response = await axios.post('http://localhost:8081/emails/send-email', emailData);
  //     if (response.status === 200) {
  //       console.log('Email sent successfully.');

  //     } else {
  //       console.error('Failed to send email.');
  //     }
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // };


  // const unpaidDecline = async () => {
  //   // const jwtToken = localStorage.getItem("token");
  //   const currentDate = new Date();

  //   // Use map to iterate through the data array
  //   request_data.map(async (item) => {
  //     const requestedDate = new Date(item.date_requested);
  //     console.log("unpaidDecline")
  //     // Check if the request is more than or equal to 3 days old and the status is "Unpaid"
  //     if (
  //       currentDate.getTime() - requestedDate.getTime() >= 3 * 24 * 60 * 60 * 1000 && // 3 days in milliseconds
  //       item.payment_status === 'Unpaid' &&
  //       item.request_status !== 'Cancelled'
  //     ) {
  //       try {
  //         const response = await fetch(`http://localhost:8081/mysql/cancel-record-request/${item.ctrl_number}`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //              Authorization: `Bearer ${jwtToken}`,
  //           },
  //         });

  //         if (response.ok) {
  //           const to_email = getStudentEmail(item.student_id);
  //           if (to_email && item.ctrl_number) {
  //             sendCancelationEmail(to_email, item.ctrl_number);
  //             console.log('sendCancelationEmail');
  //           }
  //           // Fetch updated data and update the state
  //           fetch('http://localhost:8081/mysql/email/record-request', {
  //             headers: {
  //               Authorization: `Bearer ${jwtToken}`,
  //             },
  //           })
  //           .then((res) => {
  //             if (!res.ok) {
  //               throw new Error("Failed to authenticate token");
  //             }
  //             return res.json();
  //           })
  //           .then((data) => {
  //             setRequestData(data); // Set the fetched data into the state
  //           })
  //           .catch((err) => console.log(err));
  //         } else {
  //           // Handle the case where the update request is not successful
  //         }
  //       } catch (error) {
  //         console.error('Error:', error);
  //       }
  //     }

  //     if (
  //       currentDate.getTime() - requestedDate.getTime() >= 2 * 24 * 60 * 60 * 1000 && // 2 days in milliseconds
  //       item.payment_status === 'Unpaid' &&
  //       item.request_status !== 'Cancelled' &&
  //       !item.is_payment_notified
  //     ) {
  //       const to_email = getStudentEmail(item.student_id);
  //       if (to_email && item.ctrl_number && item.total_amount) {
  //         sendReminderEmail(to_email, item.ctrl_number, item.total_amount);
  //         console.log('sendReminderEmail');
  //       }
  //     }
  //   });
  // };

  // const recordValidity = async () => {
  //   const currentDate = new Date();
  //     // Use map to iterate through the data array
      
  //     issuance_data.map(async (item) => {
  //     const date_issued = new Date(item.date_issued);    
  //     const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
  //     const lessOneYearInMilliseconds = 355 * 24 * 60 * 60 * 1000;
  //     const date_difference = currentDate - date_issued;
      
  //     if (date_difference >= oneYearInMilliseconds && !item.is_expired) {
  
  //         try {
  //         const response = await fetch(`http://localhost:8081/mysql/update-record-per-request/is_expired/${item.rpr_id}`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${jwtToken}`,
  //           },   
                  
  //         });
    
  //         if (response.status === 200) {
  //           const to_email = getStudentEmail(item.student_id);
  //           const record_type = getRecordType(item.request_record_type_id);
  
  //             if (to_email && record_type){
  //               // sendExpirationEmail(to_email, record_type, item.ipfs, item.date_issued);      
  //               console.log('sendExpirationEmail');        
  //             }
            
  //         } else {
  //           setAlertMessage('Failed to update record');
  //         }
  //       } catch (error) {
  //         console.error('Error:', error);
  //       }
  //     }
      
  //     if (date_difference >= lessOneYearInMilliseconds && !item.is_notified) {
  
  //         try {
  //         const response = await fetch(`http://localhost:8081/mysql/update-record-per-request/is_notified/${item.rpr_id}`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${jwtToken}`,
  //           },   
                  
  //         });
    
  //         if (response.status === 200) {
  //           const to_email = getStudentEmail(item.student_id);
  //           const record_type = getRecordType(item.request_record_type_id);
  
  //           if (to_email && record_type){
  //             sendNotifEmail(to_email, record_type, item.ipfs, item.date_issued);  
  //             console.log('sendNotifEmail');            
  //           }
  //         } else {
  //           setAlertMessage('Failed to update record');
  //         }
  //       } catch (error) {
  //         console.error('Error:', error);
  //       }
  //     }
  
        
      
  //   });
  // }

  // useEffect(() => {
  //   if (!!jwtToken) {
  //     const fetchData = async () => {
  //       await unpaidDecline();
  //       await recordValidity();
  //     };
  //     fetchData();
  //   }
  // }, []);
  
  const value = {
    user,
    login,
    connectWallet,
    logout,
    email, setEmail,
    password, setPassword,
    alertMessage, setAlertMessage,
    isSuccess, setIsSuccess,
    isError, setIsError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
