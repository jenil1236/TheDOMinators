import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  useTheme
} from "@mui/material";
import {
  LocalParking,
  LocationOn,
  Schedule,
  AttachMoney,
  Update
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Dark theme colors
const darkTheme = {
  background: '#0d1117',
  surface: '#161a20',
  cardBackground: '#1e222a', // New color for cards/inputs
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
const FormContainer = styled(Container)({
  padding: '2rem',
  maxWidth: '600px'
});

const FormPaper = styled(Paper)({
  background: darkTheme.surface,
  padding: '2rem',
  borderRadius: '8px',
  border: `1px solid ${darkTheme.background}`,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
});

const FormTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: darkTheme.textPrimary,
    backgroundColor: darkTheme.cardBackground, // Card-like background
    '& fieldset': {
      borderColor: darkTheme.background,
    },
    '&:hover fieldset': {
      borderColor: darkTheme.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: darkTheme.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: darkTheme.textSecondary,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: darkTheme.primary,
  },
  marginBottom: '1rem'
});

function EditParkingForm() {
  const { parkingId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    name: "",
    location: "",
    totalSlots: 1,
    availableSlots: 1,
    openTime: "",
    closeTime: "",
    rate: 0,
  });

  const [diff, setDiff] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/parkings/owner/${parkingId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const p = data.parking;
        setForm({
          name: p.name,
          location: p.location,
          totalSlots: p.totalSlots,
          availableSlots: p.availableSlots,
          openTime: p.openTime,
          closeTime: p.closeTime,
          rate: p.rate,
        });
        setDiff(p.totalSlots - p.availableSlots);
      })
      .catch((err) => console.error("Error loading parking:", err));
  }, [parkingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (name === "totalSlots") {
      const newTotal = parseInt(value);
      updated.availableSlots = Math.max(0, newTotal - diff);
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/parkings/owner/${parkingId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update parking");

      navigate(`/parkings/owner/${parkingId}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <FormContainer>
      <FormPaper elevation={3}>
        <Typography variant="h4" sx={{ 
          marginBottom: 3,
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
          Edit Parking Lot
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormTextField
            fullWidth
            label="Parking Name"
            variant="outlined"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <LocalParking sx={{ color: darkTheme.primary, mr: 1 }} />
              ),
            }}
          />

          <FormTextField
            fullWidth
            label="Location"
            variant="outlined"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <LocationOn sx={{ color: darkTheme.primary, mr: 1 }} />
              ),
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormTextField
              fullWidth
              label="Total Slots"
              variant="outlined"
              type="number"
              name="totalSlots"
              value={form.totalSlots}
              onChange={handleChange}
              inputProps={{ min: diff }}
              required
            />

            <FormTextField
              fullWidth
              label="Available Slots"
              variant="outlined"
              type="number"
              name="availableSlots"
              value={form.availableSlots}
              onChange={handleChange}
              inputProps={{ max: form.totalSlots - diff }}
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormTextField
              fullWidth
              label="Open Time"
              variant="outlined"
              type="time"
              name="openTime"
              value={form.openTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              InputProps={{
                startAdornment: (
                  <Schedule sx={{ color: darkTheme.primary, mr: 1 }} />
                ),
              }}
            />

            <FormTextField
              fullWidth
              label="Close Time"
              variant="outlined"
              type="time"
              name="closeTime"
              value={form.closeTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              InputProps={{
                startAdornment: (
                  <Schedule sx={{ color: darkTheme.primary, mr: 1 }} />
                ),
              }}
            />
          </Box>

          <FormTextField
            fullWidth
            label="Rate per Slot (₹)"
            variant="outlined"
            type="number"
            name="rate"
            value={form.rate}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <AttachMoney sx={{ color: darkTheme.primary, mr: 1 }} />
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Update />}
            sx={{
              color: '#fff',
              borderRadius: '4px',
              padding: '12px',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${darkTheme.success} 0%, #27ae60 100%)`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                background: `linear-gradient(135deg, #27ae60 0%, #219653 100%)`,
                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'scale(0.98)'
              },
              transition: 'all 0.2s ease',
              marginTop: '1rem'
            }}
          >
            Update Parking
          </Button>
        </form>
      </FormPaper>
    </FormContainer>
  );
}

export default EditParkingForm;