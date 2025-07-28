import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Tooltip,
  useTheme,
  styled 
} from '@mui/material';
import './AdminMessages.css';

const AdminMessageCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 8px 24px ${theme.palette.primary.dark}20`,
    borderColor: theme.palette.primary.light,
  },
}));

const ScoreBadge = styled('div')(({ theme, score }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  backgroundColor: 
    score >= 4 ? theme.palette.success.main :
    score === 3 ? theme.palette.warning.main :
    theme.palette.error.main,
  color: theme.palette.getContrastText(
    score >= 4 ? theme.palette.success.main :
    score === 3 ? theme.palette.warning.main :
    theme.palette.error.main
  ),
}));

const AdminMessages = ({ messages }) => {
  const theme = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box className="adminMessages-container">
      <Typography 
        variant="h4" 
        className="adminMessages-title"
        sx={{ color: theme.palette.primary.main }}
      >
        Ride Feedback
      </Typography>
      
      <Grid container spacing={3} className="adminMessages-grid">
        {messages.map((message) => (
          <Grid item xs={12} sm={6} md={4} key={message._id}>
            <AdminMessageCard className="adminMessages-card">
              <CardContent className="adminMessages-cardContent">
                <div className="adminMessages-header">
                  <ScoreBadge score={message.score} className="adminMessages-score">
                    {message.score}
                  </ScoreBadge>
                  <Typography 
                    variant="caption" 
                    className="adminMessages-date"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {formatDate(message.timestamp)}
                  </Typography>
                </div>

                {message.comment && (
                  <Typography 
                    variant="body1" 
                    className="adminMessages-comment"
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontStyle: message.comment ? 'normal' : 'italic'
                    }}
                  >
                    {message.comment || "No comment provided"}
                  </Typography>
                )}

                <div className="adminMessages-rideInfo">
                  <Typography variant="subtitle2" className="adminMessages-route">
                    {message.ride.pickupLocation} → {message.ride.dropLocation}
                  </Typography>
                  <Typography variant="caption" className="adminMessages-rideDate">
                    {new Date(message.ride.date).toLocaleDateString()}
                  </Typography>
                </div>

                <div className="adminMessages-users">
                  <Tooltip 
                    title={
                      <div className="adminMessages-userTooltip">
                        <div>Username: {message.fromUser.username}</div>
                        <div>Email: {message.fromUser.email}</div>
                      </div>
                    }
                    arrow
                  >
                    <div className="adminMessages-user">
                      <Avatar className="adminMessages-avatar">
                        {message.fromUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" className="adminMessages-username">
                        {message.fromUser.username}
                      </Typography>
                      <span className="adminMessages-userRole">(Reviewer)</span>
                    </div>
                  </Tooltip>

                  <Typography variant="body2" className="adminMessages-reviewedFor">
                    reviewed for
                  </Typography>

                  <Tooltip 
                    title={
                      <div className="adminMessages-userTooltip">
                        <div>Username: {message.toUser.username}</div>
                        <div>Email: {message.toUser.email}</div>
                      </div>
                    }
                    arrow
                  >
                    <div className="adminMessages-user">
                      <Avatar className="adminMessages-avatar">
                        {message.toUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" className="adminMessages-username">
                        {message.toUser.username}
                      </Typography>
                    </div>
                  </Tooltip>
                </div>
              </CardContent>
            </AdminMessageCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminMessages;