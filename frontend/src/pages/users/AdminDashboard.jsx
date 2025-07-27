import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { 
  People, 
  DirectionsBus, 
  AccountCircle, 
  Warning, 
  Notifications
} from '@mui/icons-material';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Dummy data
  const userData = [
    { name: 'Jan', active: 8000, banned: 500 },
    { name: 'Feb', active: 9500, banned: 300 },
    { name: 'Mar', active: 12000, banned: 243 },
    { name: 'Apr', active: 10500, banned: 400 },
    { name: 'May', active: 11000, banned: 350 },
    { name: 'Jun', active: 12345, banned: 243 },
  ];

  const pieData = [
    { name: 'Students', value: 75 },
    { name: 'Visitors', value: 25 },
  ];

  const trafficData = [
    { time: '09:00', visits: 1800 },
    { time: '12:00', visits: 2400 },
    { time: '15:00', visits: 2100 },
    { time: '18:00', visits: 2400 },
    { time: '21:00', visits: 1800 },
  ];

  return (
    <Box className="admin-dashboard-container">
      {/* Header */}
      <Typography variant="h4" className="dashboard-header">
        Transit Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            value="12,345" 
            title="Active Users" 
            icon={<People fontSize="large" />}
            color="#006bd6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            value="243" 
            title="Banned Users" 
            icon={<Warning fontSize="large" />}
            color="#f85149"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            value="1,234" 
            title="Vehicle Owners" 
            icon={<DirectionsBus fontSize="large" />}
            color="#00FFA3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            value="8,765" 
            title="Daily Visits" 
            icon={<AccountCircle fontSize="large" />}
            color="#2ea043"
          />
        </Grid>
      </Grid>

      <Divider className="section-divider" />

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* User Activity Chart */}
        <Grid item xs={12} md={8}>
          <Paper className="chart-paper">
            <Typography variant="h6" className="chart-title">
              User Activity (Last 6 Months)
            </Typography>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                  <XAxis dataKey="name" className="chart-axis" />
                  <YAxis className="chart-axis" domain={[0, 15000]} ticks={[0, 2500, 5000, 7500, 10000]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#006bd6" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="banned" 
                    stroke="#f85149" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        {/* User Distribution Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper className="chart-paper">
            <Typography variant="h6" className="chart-title">
              User Distribution
            </Typography>
            <div className="pie-container">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#006bd6" />
                    <Cell fill="#00FFA3" />
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <Stack spacing={1} className="pie-legend">
              {pieData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-color" style={{ 
                    backgroundColor: index === 0 ? '#006bd6' : '#00FFA3' 
                  }} />
                  <span className="legend-text">{item.name}</span>
                </div>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Traffic Chart */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-paper">
            <Typography variant="h6" className="chart-title">
              Daily Traffic Pattern
            </Typography>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                  <XAxis dataKey="time" className="chart-axis" />
                  <YAxis className="chart-axis" domain={[0, 3000]} ticks={[0, 600, 1200, 1800, 2400]} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#00FFA3" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-paper">
            <Typography variant="h6" className="chart-title">
              Recent Service Alerts
            </Typography>
            <Stack spacing={1} className="alerts-stack">
              {[
                'Route 12 delayed by 15 mins due to traffic',
                'Maintenance scheduled for Blue Line this weekend',
                'New shuttle service added to North Campus',
                'Mobile app update available with new features'
              ].map((alert, index) => (
                <div key={index} className="alert-item">
                  <Notifications className="alert-icon" />
                  <span className="alert-text">{alert}</span>
                </div>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const StatCard = ({ value, title, icon, color }) => (
  <Card className="stat-card">
    <CardContent className="stat-card-content">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <Typography variant="h4" className="stat-value">
        {value}
      </Typography>
      <Typography className="stat-title">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export default AdminDashboard;