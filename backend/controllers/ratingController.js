// Key Features to Cover:

// Post a rating (ride complete → rate the driver/passenger)

// Prevent duplicate ratings for same ride by same user

// Update toUser.ratingsReceived[] and averageRating accordingly

// (Optional) Get all ratings for a user



import Ride from "../models/Ride.js";
import Rating from "../models/Rating.js";
import CarpoolUser from "../models/CarpoolUser.js";

// 1. post a rating

export const rateUser = async(req,res) => {
    try {
        const {
            rideId,
            toUserId,
            score,
            comment
        } = req.body;
    
        const fromUserId = req.user._id;
    
        const ride = await Ride.findById(rideId);
        const toUser = await CarpoolUser.findById(toUserId);
        if(!ride || !toUser){
            return res.status(400).json({message: "Insufficient credentials provided"})
        }
        if(ride.status !== "completed"){
            return res.status(400).json({message: "Invalid or incomplete ride"});
        }
    
        // Prevent self-rating
        if (fromUserId.toString() === toUserId) {
          return res.status(403).json({ message: "You can't rate yourself." });
        }
    
        // prevent duplicate rating(one user should not be able to rate same person for same ride more than once)
        const existingRating = await Rating.findOne({
            ride: rideId,
            fromUser: fromUserId,
            toUser: toUserId
        })
    
        if (existingRating) {
          return res.status(409).json({ message: "You have already rated this user for this ride." });
        }
    
        const newRating = new Rating({
            ride: rideId,
            fromUser: req.user._id,
            toUser: toUserId,
            score,
            comment
        })
    
        await newRating.save();
    
        // Add this rating to the the user's ratingsReceived and recalculate avaerage
        toUser.ratingsReceived.push(newRating._id);
    
        // recalculate average
        const ratings = await Rating.find({toUser: toUserId});
    
        const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
        const avgRating = totalScore / ratings.length;
    
        toUser.averageRating = avgRating.toFixed(2); // rounded to 2 decimals
        await toUser.save();
    
        res.status(201).json({ message: "Rating submitted successfully." });
    } catch (error) {
        console.error("Error rating user:", error);
    res.status(500).json({ message: "Something went wrong while rating." });
    }

};
// get all ratings
export const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ toUser: userId })
      .populate("fromUser", "username email")
      .populate("ride", "pickupLocation dropLocation date");

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Failed to fetch user ratings" });
  }
};


