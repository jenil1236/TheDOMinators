// // import React from "react";
// // import "./rideHistoryCard.css";

// // const RideHistoryCard = ({ ride }) => {
// //   const {
// //     pickupLocation,
// //     dropLocation,
// //     date,
// //     time,
// //     status,
// //     vehicleDetails,
// //     bookedUsers,
// //     driver
// //   } = ride;

// //   const formattedDate = new Date(date).toLocaleDateString();

// //   return (
// //     <div className="ride-history-card">
// //       <div className="ride-info">
// //         <h3>{pickupLocation} ➝ {dropLocation}</h3>
// //         <p><strong>Date:</strong> {formattedDate}</p>
// //         <p><strong>Time:</strong> {time}</p>
// //         <p><strong>Status:</strong> <span className={status === "completed" ? "status-completed" : "status-cancelled"}>{status}</span></p>
// //         <p><strong>Vehicle:</strong> {vehicleDetails.model} ({vehicleDetails.number})</p>
// //       </div>

      
// //         <div className="booked-users">
// //           <h4>Booked Users</h4>
// //           {bookedUsers.map((user, idx) => (
// //             <p key={idx}>{user.username} ({user.email}) — {user.seatsBooked} seat(s)</p>
// //           ))}
// //         </div>
      
// //         <div className="driver-info">
// //           <h4>Driver Info</h4>
// //           <p>{driver?.username} ({driver?.email})</p>
// //         </div>
      
// //     </div>
// //   );
// // };

// // export default RideHistoryCard;

// import React, { useState } from "react";
// import "./rideHistoryCard.css";

// const RideHistoryCard = ({ ride, currentUser, onRatingSubmit }) => {
//   const {
//     _id: rideId,
//     pickupLocation,
//     dropLocation,
//     date,
//     time,
//     status,
//     vehicleDetails,
//     bookedUsers,
//     driver
//   } = ride;

//   const [ratingInputs, setRatingInputs] = useState({});
//   const [commentInputs, setCommentInputs] = useState({});
//   const [activeRatingPanel, setActiveRatingPanel] = useState(null);

//   const formattedDate = new Date(date).toLocaleDateString();

//   const handleRatingChange = (userId, score) => {
//     setRatingInputs(prev => ({ ...prev, [userId]: score }));
//   };

//   const handleCommentChange = (userId, comment) => {
//     setCommentInputs(prev => ({ ...prev, [userId]: comment }));
//   };

//   const submitRating = (toUserId) => {
//     const score = ratingInputs[toUserId];
//     const comment = commentInputs[toUserId] || '';
//     if (score) {
//       onRatingSubmit(rideId, toUserId, score, comment);
//       setActiveRatingPanel(null);
//     }
//   };

//   const toggleRatingPanel = (userId) => {
//     setActiveRatingPanel(activeRatingPanel === userId ? null : userId);
//   };

//   const isDriver = currentUser?._id === driver?._id;
//   const isPassenger = bookedUsers.some(user => user._id === currentUser?._id);

//   return (
//     <div className="ride-history-card">
//       <div className="ride-info">
//         <h3>{pickupLocation} ➝ {dropLocation}</h3>
//         <p><strong>Date:</strong> {formattedDate}</p>
//         <p><strong>Time:</strong> {time}</p>
//         <p><strong>Status:</strong> <span className={status === "completed" ? "status-completed" : "status-cancelled"}>{status}</span></p>
//         <p><strong>Vehicle:</strong> {vehicleDetails.model} ({vehicleDetails.number})</p>
//       </div>

//       {status === "completed" && (
//         <div className="rating-section">
//           <h3>Rate Your Experience</h3>
          
//           {/* Driver can rate passengers */}
//           {isDriver && bookedUsers.length > 0 && (
//             <div className="rate-group">
//               <h4>Rate Passengers:</h4>
//               {bookedUsers.map(user => (
//                 <div key={user._id} className="rate-user">
//                   <button 
//                     className="toggle-rating-btn"
//                     onClick={() => toggleRatingPanel(user._id)}
//                   >
//                     Rate {user.username}
//                   </button>
//                   {activeRatingPanel === user._id && (
//                     <div className="rating-panel">
//                       <div className="stars">
//                         {[1, 2, 3, 4, 5].map(star => (
//                           <span 
//                             key={star}
//                             className={`star ${ratingInputs[user._id] >= star ? 'active' : ''}`}
//                             onClick={() => handleRatingChange(user._id, star)}
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                       <textarea
//                         placeholder="Add a comment (optional)"
//                         value={commentInputs[user._id] || ''}
//                         onChange={(e) => handleCommentChange(user._id, e.target.value)}
//                       />
//                       <button 
//                         className="submit-rating-btn"
//                         onClick={() => submitRating(user._id)}
//                       >
//                         Submit Rating
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Passengers can rate driver and other passengers */}
//           {isPassenger && (
//             <>
//               <div className="rate-group">
//                 <h4>Rate Driver:</h4>
//                 <div className="rate-user">
//                   <button 
//                     className="toggle-rating-btn"
//                     onClick={() => toggleRatingPanel(driver._id)}
//                   >
//                     Rate {driver.username}
//                   </button>
//                   {activeRatingPanel === driver._id && (
//                     <div className="rating-panel">
//                       <div className="stars">
//                         {[1, 2, 3, 4, 5].map(star => (
//                           <span 
//                             key={star}
//                             className={`star ${ratingInputs[driver._id] >= star ? 'active' : ''}`}
//                             onClick={() => handleRatingChange(driver._id, star)}
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                       <textarea
//                         placeholder="Add a comment (optional)"
//                         value={commentInputs[driver._id] || ''}
//                         onChange={(e) => handleCommentChange(driver._id, e.target.value)}
//                       />
//                       <button 
//                         className="submit-rating-btn"
//                         onClick={() => submitRating(driver._id)}
//                       >
//                         Submit Rating
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {bookedUsers.length > 1 && (
//                 <div className="rate-group">
//                   <h4>Rate Other Passengers:</h4>
//                   {bookedUsers
//                     .filter(user => user._id !== currentUser._id)
//                     .map(user => (
//                       <div key={user._id} className="rate-user">
//                         <button 
//                           className="toggle-rating-btn"
//                           onClick={() => toggleRatingPanel(user._id)}
//                         >
//                           Rate {user.username}
//                         </button>
//                         {activeRatingPanel === user._id && (
//                           <div className="rating-panel">
//                             <div className="stars">
//                               {[1, 2, 3, 4, 5].map(star => (
//                                 <span 
//                                   key={star}
//                                   className={`star ${ratingInputs[user._id] >= star ? 'active' : ''}`}
//                                   onClick={() => handleRatingChange(user._id, star)}
//                                 >
//                                   ★
//                                 </span>
//                               ))}
//                             </div>
//                             <textarea
//                               placeholder="Add a comment (optional)"
//                               value={commentInputs[user._id] || ''}
//                               onChange={(e) => handleCommentChange(user._id, e.target.value)}
//                             />
//                             <button 
//                               className="submit-rating-btn"
//                               onClick={() => submitRating(user._id)}
//                             >
//                               Submit Rating
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       <div className="booked-users">
//         <h4>Booked Users</h4>
//         {bookedUsers.length > 0 ? (
//           bookedUsers.map((user, idx) => (
//             <p key={idx}>{user.username} ({user.email}) — {user.seatsBooked} seat(s)</p>
//           ))
//         ) : (
//           <p>No passengers booked</p>
//         )}
//       </div>

//       <div className="driver-info">
//         <h4>Driver Info</h4>
//         <p>{driver?.username} ({driver?.email})</p>
//       </div>
//     </div>
//   );
// };

// export default RideHistoryCard;

import React, { useState } from "react";
import "./rideHistoryCard.css";

const RideHistoryCard = ({ ride, currentUserId, onRatingSubmit }) => {
  const {
    _id: rideId,
    pickupLocation,
    dropLocation,
    date,
    time,
    status,
    vehicleDetails,
    bookedUsers,
    driver
  } = ride;

  const [ratingInputs, setRatingInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [activeRatingPanel, setActiveRatingPanel] = useState(null);

  const formattedDate = new Date(date).toLocaleDateString();

  const handleRatingChange = (userId, score) => {
    setRatingInputs(prev => ({ ...prev, [userId]: score }));
  };

  const handleCommentChange = (userId, comment) => {
    setCommentInputs(prev => ({ ...prev, [userId]: comment }));
  };

  const submitRating = (toUserId) => {
    const score = ratingInputs[toUserId];
    const comment = commentInputs[toUserId] || '';
    if (score) {
      onRatingSubmit(rideId, toUserId, score, comment);
      setActiveRatingPanel(null);
    } else {
      alert("Please select a rating");
    }
  };

  const toggleRatingPanel = (userId) => {
    setActiveRatingPanel(activeRatingPanel === userId ? null : userId);
  };

  // Filter out current user from people to rate
  const usersToRate = [
    ...(driver?._id !== currentUserId ? [driver] : []),
    ...bookedUsers.filter(user => user._id !== currentUserId)
  ];

  return (
    <div className="ride-history-card">
      <div className="ride-info">
        <h3>{pickupLocation} ➝ {dropLocation}</h3>
        <p><strong>Date:</strong> {formattedDate}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Status:</strong> <span className={status === "completed" ? "status-completed" : "status-cancelled"}>{status}</span></p>
        <p><strong>Vehicle:</strong> {vehicleDetails.model} ({vehicleDetails.number})</p>
      </div>

      {status === "completed" && usersToRate.length > 0 && (
        <div className="rating-section">
          <h3>Rate Your Experience</h3>
          
          {usersToRate.map(user => (
            <div key={user._id} className="rate-user">
              <button 
                className="toggle-rating-btn"
                onClick={() => toggleRatingPanel(user._id)}
              >
                Rate {user.username} ({user._id === driver?._id ? "Driver" : "Passenger"})
              </button>
              {activeRatingPanel === user._id && (
                <div className="rating-panel">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span 
                        key={star}
                        className={`star ${ratingInputs[user._id] >= star ? 'active' : ''}`}
                        onClick={() => handleRatingChange(user._id, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Add a comment (optional)"
                    value={commentInputs[user._id] || ''}
                    onChange={(e) => handleCommentChange(user._id, e.target.value)}
                  />
                  <button 
                    className="submit-rating-btn"
                    onClick={() => submitRating(user._id)}
                  >
                    Submit Rating
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="booked-users">
        <h4>Booked Users</h4>
        {bookedUsers.length > 0 ? (
          bookedUsers.map((user, idx) => (
            <p key={idx}>{user.username} ({user.email}) — {user.seatsBooked} seat(s)</p>
          ))
        ) : (
          <p>No passengers booked</p>
        )}
      </div>

      <div className="driver-info">
        <h4>Driver Info</h4>
        <p>{driver?.username} ({driver?.email})</p>
      </div>
    </div>
  );
};

export default RideHistoryCard;