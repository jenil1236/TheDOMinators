import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceivedRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReceivedRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/requests/received', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load received requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `/api/requests/update/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data.message);
      fetchReceivedRequests(); // Refresh the list after update
    } catch (err) {
      console.error('Error updating request status:', err.response?.data || err.message);
      alert('Failed to update status. Only "accepted" or "rejected" allowed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Received Requests</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {requests.length > 0 ? (
        requests.map((req) => (
          <div key={req._id} className="bg-white shadow p-5 rounded mb-4 border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {req.ride.pickupLocation} ➝ {req.ride.dropLocation}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(req.ride.date).toDateString()}
              </span>
            </div>

            <p><strong>Passenger:</strong> {req.fromUser.username}</p>
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

            {req.status === 'pending' && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleUpdateStatus(req._id, 'accepted')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus(req._id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No requests received yet.</p>
      )}
    </div>
  );
};

export default ReceivedRequestsPage;
