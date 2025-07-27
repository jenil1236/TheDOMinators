import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme
} from "@mui/material";
import {
  LocalParking,
  People,
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
const DashboardButton = styled(Button)(({ theme }) => ({
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));



function AdminDashboard({setIsAdmin}) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: darkTheme.background,
      p: 3
    }}>
      <Typography variant="h4" sx={{ 
        mb: 4,
        color: darkTheme.primary,
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
        Admin Dashboard
      </Typography>

      <Stack spacing={2} sx={{ width: '100%', maxWidth: '400px' }}>
        <DashboardButton
          variant="contained"
          startIcon={<LocalParking />}
          onClick={() => navigate("/parkings")}
          sx={{
            background: `linear-gradient(135deg, ${darkTheme.primary} 0%, #2a7fd9 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, #4a8fd6 0%, #2a7fd9 100%)`
            }
          }}
        >
          View Parkings
        </DashboardButton>

        <DashboardButton
          variant="contained"
          startIcon={<People />}
          onClick={() => navigate("/admin/parkingusers")}
          sx={{
            background: `linear-gradient(135deg, ${darkTheme.accent} 0%, #3ab795 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, #3ab795 0%, #2a9d7f 100%)`
            }
          }}
        >
          View Parking Users
        </DashboardButton>
        <DashboardButton
          variant="contained"
          startIcon={<People />}
          onClick={() => navigate("/admin/stops")}
          sx={{
            background: `linear-gradient(135deg, ${darkTheme.accent} 0%, #3ab795 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, #3ab795 0%, #2a9d7f 100%)`
            }
          }}
        >
          View BRTS Stops
        </DashboardButton>
      </Stack>
    </Box>
  );
}

export default AdminDashboard;