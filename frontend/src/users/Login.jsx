import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  useTheme
} from "@mui/material";
import {
  Lock,
  Person,
  HowToReg
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Dark theme colors
const darkTheme = {
  background: '#0d1117',
  surface: '#161a20',
  primary: '#569cd6',
  secondary: '#9cdcfe',
  textPrimary: '#9ba3b4',
  textSecondary: '#858585',
  accent: '#4ec9b0',
  error: '#f48771',
  warning: '#dcdcaa',
  success: '#2ecc71'
};

// Styled components
const LoginContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: darkTheme.background,
});

const LoginPaper = styled(Paper)({
  background: darkTheme.surface,
  padding: '40px',
  borderRadius: '8px',
  border: `1px solid ${darkTheme.background}`,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  width: '100%',
  maxWidth: '400px',
});

const LoginButton = styled(Button)({
  width: '100%',
  padding: '12px',
  borderRadius: '4px',
  fontWeight: 600,
  marginTop: '16px',
  background: `linear-gradient(135deg, ${darkTheme.primary} 0%, #2a7fd9 100%)`,
  '&:hover': {
    background: `linear-gradient(135deg, #4a8fd6 0%, #2a7fd9 100%)`,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  transition: 'all 0.2s ease',
});

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { refreshAuth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      console.log("Login successful", data);
      await refreshAuth();
      navigate("/parkings");
    } catch (err) {
      setError(err.message);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <LoginContainer>
      <LoginPaper elevation={3}>
        <Typography variant="h4" sx={{ 
          mb: 3,
          color: darkTheme.primary,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: darkTheme.primary,
            borderRadius: '2px',
          }
        }}>
          Sign In
        </Typography>

        {error && (
          <Typography color="error" sx={{ 
            textAlign: 'center',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <Person sx={{ color: darkTheme.textSecondary, mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: darkTheme.textPrimary,
                backgroundColor: darkTheme.cardBackground,
                '& fieldset': {
                  borderColor: darkTheme.background,
                },
                '&:hover fieldset': {
                  borderColor: darkTheme.primary,
                },
              },
              '& .MuiInputLabel-root': {
                color: darkTheme.textSecondary,
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <Lock sx={{ color: darkTheme.textSecondary, mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: darkTheme.textPrimary,
                backgroundColor: darkTheme.cardBackground,
                '& fieldset': {
                  borderColor: darkTheme.background,
                },
                '&:hover fieldset': {
                  borderColor: darkTheme.primary,
                },
              },
              '& .MuiInputLabel-root': {
                color: darkTheme.textSecondary,
              },
            }}
          />

          <LoginButton
            type="submit"
            variant="contained"
            startIcon={<Lock />}
          >
            Log In
          </LoginButton>
        </Box>

        <Box sx={{ 
          mt: 3,
          textAlign: 'center',
          color: darkTheme.textSecondary
        }}>
          <Link
            component="button"
            variant="body2"
            onClick={goToRegister}
            sx={{
              color: darkTheme.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <HowToReg fontSize="small" />
            Don't have an account? Register
          </Link>
        </Box>
      </LoginPaper>
    </LoginContainer>
  );
}

export default Login;