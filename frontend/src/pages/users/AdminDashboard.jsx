import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  styled,
  useTheme,
  Zoom
} from '@mui/material';
import {
  People as UsersIcon,
  Block as BannedIcon,
  DirectionsBus as BusStopIcon,
  Visibility as VisitIcon,
  Business as OwnerIcon
} from '@mui/icons-material';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const mockData = {
  activeUsers: 1243,
  bannedUsers: 87,
  busStops: 56,
  siteVisits: 8924,
  owners: 215,
  userOwnerRatio: {
    users: 1243,
    owners: 215
  },
  visitorStats: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [3200, 4200, 5100, 5800, 7200, 8924]
  }
};

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6]
  }
}));

const StatIcon = styled(Box)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const AdminDashboard = () => {
  const theme = useTheme();

  const pieData = {
    labels: ['Users', 'Owners'],
    datasets: [
      {
        data: [mockData.userOwnerRatio.users, mockData.userOwnerRatio.owners],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main
        ],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.secondary.dark
        ],
        borderWidth: 1
      }
    ]
  };

  const lineData = {
    labels: mockData.visitorStats.labels,
    datasets: [
      {
        label: 'Monthly Visitors',
        data: mockData.visitorStats.data,
        fill: false,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.light,
        tension: 0.4,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointHoverRadius: 6
      }
    ]
  };

  const stats = [
    {
      title: 'Active Users',
      value: mockData.activeUsers,
      icon: <UsersIcon fontSize="inherit" />,
      color: theme.palette.success.main
    },
    {
      title: 'Banned Users',
      value: mockData.bannedUsers,
      icon: <BannedIcon fontSize="inherit" />,
      color: theme.palette.error.main
    },
    {
      title: 'Bus Stops',
      value: mockData.busStops,
      icon: <BusStopIcon fontSize="inherit" />
    },
    {
      title: 'Site Visits',
      value: mockData.siteVisits,
      icon: <VisitIcon fontSize="inherit" />,
      color: theme.palette.warning.main
    },
    {
      title: 'Owners',
      value: mockData.owners,
      icon: <OwnerIcon fontSize="inherit" />
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" mb={3} fontWeight={600} color="primary">
        City Transit Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
              <StatCard>
                <StatIcon>{stat.icon}</StatIcon>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ color: stat.color || 'text.primary' }}>
                    {stat.value.toLocaleString()}
                  </Typography>
                </Box>
              </StatCard>
            </Zoom>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, p: 2 }}>
            <Typography variant="h6" mb={2}>
              Users vs Owners
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: theme.palette.text.primary
                      }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, p: 2 }}>
            <Typography variant="h6" mb={2}>
              Monthly Visitors
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={lineData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { color: theme.palette.divider },
                      ticks: { color: theme.palette.text.secondary }
                    },
                    y: {
                      grid: { color: theme.palette.divider },
                      ticks: { color: theme.palette.text.secondary }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: theme.palette.text.primary
                      }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Stack,
//   useTheme
// } from "@mui/material";
// import {
//   LocalParking,
//   People,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";

// // Dark theme colors
// const darkTheme = {
//   background: '#0d1117',
//   surface: '#161a20',
//   primary: '#569cd6',
//   secondary: '#9cdcfe',
//   textPrimary: '#9ba3b4',
//   textSecondary: '#858585',
//   accent: '#4ec9b0',
//   error: '#f48771',
//   warning: '#dcdcaa',
//   success: '#2ecc71'
// };

// // Styled components
// const DashboardButton = styled(Button)(({ theme }) => ({
//   padding: '12px 24px',
//   borderRadius: '8px',
//   fontWeight: 600,
//   textTransform: 'none',
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: theme.shadows[4],
//   }
// }));



// function AdminDashboard({setIsAdmin}) {
//   const navigate = useNavigate();
//   const theme = useTheme();

//   return (
//     <Box sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: '100vh',
//       background: darkTheme.background,
//       p: 3
//     }}>
//       <Typography variant="h4" sx={{ 
//         mb: 4,
//         color: darkTheme.primary,
//         position: 'relative',
//         '&:after': {
//           content: '""',
//           position: 'absolute',
//           bottom: '-10px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           width: '80px',
//           height: '4px',
//           background: darkTheme.primary,
//           borderRadius: '2px',
//         }
//       }}>
//         Admin Dashboard
//       </Typography>

//       <Stack spacing={2} sx={{ width: '100%', maxWidth: '400px' }}>
//         <DashboardButton
//           variant="contained"
//           startIcon={<LocalParking />}
//           onClick={() => navigate("/parkings")}
//           sx={{
//             background: `linear-gradient(135deg, ${darkTheme.primary} 0%, #2a7fd9 100%)`,
//             '&:hover': {
//               background: `linear-gradient(135deg, #4a8fd6 0%, #2a7fd9 100%)`
//             }
//           }}
//         >
//           View Parkings
//         </DashboardButton>

//         <DashboardButton
//           variant="contained"
//           startIcon={<People />}
//           onClick={() => navigate("/admin/parkingusers")}
//           sx={{
//             background: `linear-gradient(135deg, ${darkTheme.accent} 0%, #3ab795 100%)`,
//             '&:hover': {
//               background: `linear-gradient(135deg, #3ab795 0%, #2a9d7f 100%)`
//             }
//           }}
//         >
//           View Parking Users
//         </DashboardButton>
//         <DashboardButton
//           variant="contained"
//           startIcon={<People />}
//           onClick={() => navigate("/admin/stops")}
//           sx={{
//             background: `linear-gradient(135deg, ${darkTheme.accent} 0%, #3ab795 100%)`,
//             '&:hover': {
//               background: `linear-gradient(135deg, #3ab795 0%, #2a9d7f 100%)`
//             }
//           }}
//         >
//           View BRTS Stops
//         </DashboardButton>
//         <DashboardButton
//           variant="contained"
//           startIcon={<People />}
//           onClick={() => navigate("/admin/reports")}
//           sx={{
//             background: `linear-gradient(135deg, ${darkTheme.accent} 0%, #3ab795 100%)`,
//             '&:hover': {
//               background: `linear-gradient(135deg, #3ab795 0%, #2a9d7f 100%)`
//             }
//           }}
//         >
//           View Reports
//         </DashboardButton>
//       </Stack>
//     </Box>
//   );
// }

// export default AdminDashboard;