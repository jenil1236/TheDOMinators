import Ride from "../models/Ride.js";
import User from "../models/User.js";
import CarpoolUser from "../models/CarpoolUser.js";


export const postRide = async (req, res) => {
  
  try {
    const {
       pickupLocation,
       dropLocation,
       time,
       date,
       availableSeats,
      vehicleDetails,
      pricePerSeat
    } = req.body;

    // Step 1: Find the CarpoolUser associated with this User
const carpoolUser = await CarpoolUser.findOne({ user: req.user._id });

if (!carpoolUser) {
  return res.status(404).json({ message: "CarpoolUser profile not found" });
}

// Step 2: Use CarpoolUser _id in the ride
const ride = new Ride({
  driver: carpoolUser._id,
  pickupLocation,
  dropLocation,
  date,
  time,
  availableSeats,
  vehicleDetails,
  pricePerSeat
});


    await ride.save();
    carpoolUser.ridesPosted.push(ride._id);
    await carpoolUser.save();


    res.status(201).json({ message: "Ride posted successfully", ride });
  } catch (error) {
    res.status(500).json({ message: "Error posting ride", error: error.message });
  }
};

export const searchRides = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, date } = req.query;

    const query = {};

    if (pickupLocation) {
      query.pickupLocation = { $regex: pickupLocation, $options: "i" };
    }

    if (dropLocation) {
      query.dropLocation = { $regex: dropLocation, $options: "i" };
    }

    if (date) {
      query.date = date;
    }

    const rides = await Ride.find(query).populate({
      path: "driver",
      populate: [
        {
          path: "user",
          model: "User",
          select: "username email"
        },
        {
          path: "ratingsReceived",
          model: "Rating",
          select: "score comment"
        }
      ]
    });

    const result = rides.map((ride) => {
      const { driver, ...rest } = ride.toObject();

      return {
        ...rest,
        driver: {
          username: driver?.user?.username || "N/A",
          email: driver?.user?.email || "N/A",
          averageRating: driver?.averageRating || 0,
          feedbacks: driver?.ratingsReceived?.map(r => ({
            score: r.score,
            comment: r.comment
          })) || []
        }
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error searching ride", error: error.message });
  }
};


export const getPostedRides = async (req, res) => {
  try {
   const carpoolUser = await CarpoolUser.findOne({ user: req.user._id });
if (!carpoolUser) return res.status(404).json({ message: "Carpool user not found" });

const rides = await Ride.find({ driver: carpoolUser._id });
res.status(200).json(rides);

  } catch (error) {
    res.status(500).json({ message: "Error searching your posted rides", error: error.message });
  }
};

export const getBookedRides = async (req, res) => {
  try {
    const rides = await Ride.find({bookedUsers: req.user._id}); // bookedUsers is an array but still this works
    res.status(200).json(rides)
  } catch (error) {
    res.status(500).json({ message: "Error searching your booked rides", error: error.message });
  }
};

export const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { driver: req.user._id },
        { bookedUsers: req.user._id }
      ],
      status: { $in: ["completed", "cancelled"] }

    })
    .populate("driver", "username email")
    .populate("bookedUsers", "username email");

    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

export const cancelUpcomingRide = async(req,res) => {
  try {
    const {
      rideId
    } = req.body;
  
    const ride = await Ride.findById(rideId);
    if(!ride) return res.status(404).json({message: "This ride doesnt even exist"});
  
    if(ride.status === "completed" || ride.status === "cancelled"){
      return res.status(400).json({message: "This ride exists but the request is invalid(completed or already cancelled)"});
    }

    if (!ride.driver.equals(req.user._id)) {
  return res.status(403).json({ message: "You are not authorized to cancel this ride" });
}
  
    ride.status = "cancelled";
    await ride.save();

    return res.status(200).json({message: "Ride status updated to cancelled succesfully"});

  } catch (error) {

    return res.status(403).json({message: "Failed to cancel the ride"});
  }


};

