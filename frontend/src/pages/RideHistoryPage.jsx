// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import RideHistoryCard from "../components/RideHistoryCard";

// // const RideHistoryPage = () => {
// //   const [rides, setRides] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchHistory = async () => {
// //       try {
// //         const response = await axios.get("http://localhost:5000/api/rides/history", {
// //           withCredentials: true,
// //         });
// //         setRides(response.data || []);
// //       } catch (error) {
// //         console.error("Error fetching ride history", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchHistory();
// //   }, []);

// //   return (
// //     <div className="max-w-4xl mx-auto mt-10 px-4">
// //       <h2 className="text-2xl font-bold text-gray-800 mb-6">Ride History</h2>

// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : rides.length === 0 ? (
// //         <p>No ride history found.</p>
// //       ) : (
// //         rides.map((ride, index) => <RideHistoryCard key={index} ride={ride} />)
// //       )}
// //     </div>
// //   );
// // };

// // export default RideHistoryPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import RideHistoryCard from "../components/RideHistoryCard";

// const RideHistoryPage = () => {
//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [historyResponse, userResponse] = await Promise.all([
//           axios.get("http://localhost:5000/api/rides/history", { withCredentials: true }),
//           axios.get("http://localhost:5000/api/users/me", { withCredentials: true })
//         ]);
//         setRides(historyResponse.data || []);
//         setCurrentUser(userResponse.data);
//       } catch (error) {
//         console.error("Error fetching data", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleRatingSubmit = async (rideId, toUserId, score, comment) => {
//     try {
//       await axios.post("http://localhost:5000/api/ratings", 
//         { rideId, toUserId, score, comment },
//         { withCredentials: true }
//       );
//       // Refresh ride history to show updated ratings
//       const response = await axios.get("http://localhost:5000/api/rides/history", {
//         withCredentials: true,
//       });
//       setRides(response.data || []);
//     } catch (error) {
//       console.error("Error submitting rating", error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Ride History</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : rides.length === 0 ? (
//         <p>No ride history found.</p>
//       ) : (
//         rides.map((ride, index) => (
//           <RideHistoryCard 
//             key={index} 
//             ride={ride} 
//             currentUser={currentUser}
//             onRatingSubmit={handleRatingSubmit}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default RideHistoryPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import RideHistoryCard from "../components/RideHistoryCard";

const RideHistoryPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/rides/history", { withCredentials: true }),
          axios.get("http://localhost:5000/api/carpool/me", { withCredentials: true })
        ]);
        setRides(historyResponse.data || []);
        setCurrentUserId(userResponse.data._id);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRatingSubmit = async (rideId, toUserId, score, comment) => {
    try {
      await axios.post("http://localhost:5000/api/ratings", 
        { rideId, toUserId, score, comment },
        { withCredentials: true }
      );
      // Refresh ride history to show updated ratings
      const response = await axios.get("http://localhost:5000/api/rides/history", {
        withCredentials: true,
      });
      setRides(response.data || []);
    } catch (error) {
      console.error("Error submitting rating", error);
      alert(error.response?.data?.message || "Failed to submit rating");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ride History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : rides.length === 0 ? (
        <p>No ride history found.</p>
      ) : (
        rides.map((ride, index) => (
          <RideHistoryCard 
            key={index} 
            ride={ride} 
            currentUserId={currentUserId}
            onRatingSubmit={handleRatingSubmit}
          />
        ))
      )}
    </div>
  );
};

export default RideHistoryPage;