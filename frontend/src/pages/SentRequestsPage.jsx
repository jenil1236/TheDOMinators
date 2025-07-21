import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/requests/sent', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load sent requests.');
      }
    };

    fetchSentRequests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Sent Requests</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {requests.length > 0 ? (
        requests.map((req) => (
          <div
            key={req._id}
            className="bg-white shadow-md p-6 rounded-lg mb-4 border"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {req.ride.pickupLocation} ➝ {req.ride.dropLocation}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(req.ride.date).toDateString()}
              </span>
            </div>

            <p><strong>Driver:</strong> {req.toUser?.username}</p>
            <p><strong>Seats Requested:</strong> {req.seatsRequested}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`font-semibold ${
                  req.status === 'pending'
                    ? 'text-yellow-500'
                    : req.status === 'accepted'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No requests sent yet.</p>
      )}
    </div>
  );
};

export default SentRequestsPage;
