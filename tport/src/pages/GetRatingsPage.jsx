import React, { useEffect, useState } from "react";
import axios from "axios";
import RatingCard from "../components/RatingCard";
import { useNavigate } from "react-router-dom";

const GetRatingsPage = () => {
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get the carpool user ID
        const carpoolUserRes = await axios.get(
          "http://localhost:5000/api/carpool/me",
          { withCredentials: true }
        );
        const carpoolUserId = carpoolUserRes.data._id;

        // Then get the ratings using carpool user ID
        const ratingsRes = await axios.get(
          `http://localhost:5000/api/ratings/${carpoolUserId}`,
          { withCredentials: true }
        );
        
        setRatingsData(ratingsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        navigate("/"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!ratingsData) {
    return <div className="error">Error loading ratings</div>;
  }

  return (
    <div className="ratings-page">
      <div className="ratings-header">
        <h2>Your Ratings</h2>
        <div className="average-rating">
          <span>Average Rating: </span>
          <span className="average-score">{ratingsData.averageRating}</span>
          <div className="average-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.round(ratingsData.averageRating) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ratings-list">
        {ratingsData.ratings.length > 0 ? (
          ratingsData.ratings.map((rating, index) => (
            <RatingCard key={index} rating={rating} />
          ))
        ) : (
          <p className="no-ratings">No ratings yet</p>
        )}
      </div>
    </div>
  );
};

export default GetRatingsPage;