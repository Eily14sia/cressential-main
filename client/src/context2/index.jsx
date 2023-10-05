import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize with null for logged out state
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

//   const login = (userData) => {
//     // Implement your login logic here and set the user object if login is successful
//   };

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
        console.log(walletAddress);
        await login(account);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not available in this browser.");
    }
  }

// Define a function to handle form submission
    const login = async (wallet_address) => {
        try {
            // Make an authentication request to your server or API
            const response = await fetch('http://localhost:8081/mysql/login', {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
