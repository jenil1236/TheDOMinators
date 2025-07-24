import express from 'express';
import Parking from '../../models/parking.js';
import ParkingUser from '../../models/parkinguser.js';

const router = express.Router();

// 🔑 Admin login endpoint (validates master key)
router.get('/login', (req, res) => {
  const { key } = req.query;
  const masterKeys = process.env.ADMIN_KEYS?.split(',') || [];

  if (masterKeys.includes(key)) {
    req.session.isAdmin = true;

    const responseData = {
      user: null,
      isAdmin: true,
      token: 'abc',
      message: 'Admin authenticated successfully'
    };
    console.log('Response data:', responseData);  // <---- LOG HERE);
    res.status(200).json(responseData);
  } else {
    console.log('Invalid master key:', key);  // <---- LOG INVALID KEY
    res.status(401).json({ message: 'Invalid master key' });
  }
})



// 🧠 Admin dashboard access check
router.get('/dashboard', (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized admin access' });
  }

  res.status(200).json({ message: 'Welcome to Admin Dashboard', isAdmin: true });
});

// 🚪 Admin logout
// router.post('/logout', (req, res) => {
//   req.session.isAdmin = false;
//   req.isAdmin = false;
//   res.status(200).json({ message: 'Admin logged out' });
// });

export default router;