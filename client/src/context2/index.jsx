import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const login = async () => {

    setIsSuccess(false);
    setIsError(false);

    const loginRecord = {
      email: email,
      password: password,
    };
    
    if (!email || !password){
      setIsError(true);
      setAlertMessage('Email and password are required.');
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
    
  };

  async function connectWallet() {
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
        
        await login_metamask(account);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not available in this browser.");
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

            // Extract user_role from the user object
            const user_role = user ? user.role : null;
            const user_id = user? user.user_id : null;
            localStorage.setItem('user_role', user_role);
            localStorage.setItem('user_id', user_id);

            // Save the token in localStorage or sessionStorage
            localStorage.setItem('token', token);
            
            // Redirect the user to the dashboard or perform other actions
            console.log('Login successful');
            navigate('/dashboard');
            } else {
            // Authentication failed
            // You can display an error message to the user
            console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
