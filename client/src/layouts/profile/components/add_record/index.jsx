import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";
import MDTypography from "../../../../components/MDTypography";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FormHelperText from '@mui/material/FormHelperText';

function DialogBox({ open, onClose, onSubmit, password, initialPassword, setPassword, setInitialPassword, 
  currentPassword, setCurrentPassword,  accountPassword, passwordHash, setPasswordHash}) {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showInitialPassword, setShowInitialPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPassword = hashArray.map((byte) => ('00' + byte.toString(16)).slice(-2)).join('');
      console.log('Hashed Password:', hashedPassword);
      setPasswordHash(hashedPassword);
      // You can perform further actions with the hashed password here
    } catch (error) {
      console.error('Error hashing the password:', error);
    }
  };

  useEffect(() => {
    if (currentPassword) {
      hashPassword(currentPassword);
    }
  }, [currentPassword]);

  const handleInitialPasswordVisibility = () => {
    setShowInitialPassword(!showInitialPassword);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  console.log("account password:", accountPassword);
  console.log("hashedPassword:", passwordHash);

  const handleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  function isValidPassword(password) {
    // Check for a minimum length of 8 characters
    const hasMinimumLength = password.length >= 8;
  
    // You can add other conditions here as needed
    // For example, requiring at least one uppercase letter, one lowercase letter, and one digit
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
  
    // Combine the conditions using logical AND (&&) to enforce all criteria
    return hasMinimumLength && hasUppercase && hasLowercase && hasDigit;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Password
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
      <form onSubmit={onSubmit}>
        <Grid container justifyContent="center" alignItems="center"> 
        
          <Grid item textAlign="center" mt={2} xs={11} >
            <MDInput
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword || ''}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              sx={{ width: '100%' }}
              error={passwordHash && (passwordHash != accountPassword)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleCurrentPasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                      size="small"
                      sx={{marginRight: "15px"}}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <MDBox sx={{ textAlign: "left" }}>
              {passwordHash && (passwordHash != accountPassword) && (
              <FormHelperText error>
                The password you entered do not match with your current password.
            </FormHelperText>
              )}
            </MDBox>
          </Grid>
          <Grid item textAlign="center" mt={2} xs={11} >
            <MDInput
              label="New Password"
              disabled={passwordHash ? passwordHash != accountPassword : true}
              type={showInitialPassword ? 'text' : 'password'}
              value={initialPassword || ''}
              onChange={(e) => setInitialPassword(e.target.value)}
              required
              sx={{ width: '100%' }}
              error={initialPassword && !isValidPassword(initialPassword)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleInitialPasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                      size="small"
                      sx={{marginRight: "15px"}}
                    >
                      {showInitialPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <MDBox sx={{ textAlign: "left" }}>
              {initialPassword && !isValidPassword(initialPassword) && (
              <FormHelperText error>
                * Password should be at least 8 characters long <br/> 
                * It should contain an uppercase letter, a lowercase letter, and a digit.

            </FormHelperText>
              )}
            </MDBox>
          </Grid>
          <Grid item textAlign="center" mt={2} xs={11} mb={3}>
            <MDInput
              type={showPassword ? 'text' : 'password'}
              disabled={passwordHash ? passwordHash != accountPassword : true}
              label="Re-type Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}    
              required              
              fullWidth             
              error={password && password !== initialPassword}  
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handlePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                      size="small"
                      sx={{marginRight: "15px"}}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <MDBox sx={{ textAlign: "left" }}>
              {password && password !== initialPassword && (
              <FormHelperText error>
                Passwords do not match.
              </FormHelperText>
              
              )}
            </MDBox>
          </Grid>
          <Grid item  xs={11} mb={3}>
             <MDTypography variant="caption" color="textSecondary">
               After successful password change, you will be logged out and redirected to the home page.
              </MDTypography>                 
          </Grid>
        </Grid>
      
        <MDBox
          component="hr"
          sx={{ opacity: 0.2 }}
        />
        <MDBox pt={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="contained"
            color="info"
            type="submit"
            disabled={initialPassword && !isValidPassword(initialPassword) || password && password !== initialPassword}
          >
            Submit
          </MDButton>
        </MDBox>
        
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogBox;
