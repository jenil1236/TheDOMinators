const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const Stop = require("./models/stop.js");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

main()
    .then(() => {
        console.log("connected to database");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Timetable');
}


// Get all stops
app.get('/api/stops', async (req, res) => {
    try {
        const stops = await Stop.find();
        res.status(200).json(stops);
    } catch (err) {
        console.error('Error fetching stops:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a stop
app.post('/api/stops', async (req, res) => {
    try {
        const stop = new Stop(req.body);
        await stop.save();
        res.status(201).json(stop);  // Send the created stop as a response
    } catch (error) {
        console.error('Error saving stop:', error);
        res.status(500).json({ error: 'Failed to create stop' });
    }
});

// Update a task
app.put('/api/stops/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStop = await Stop.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedStop) {
      return res.status(404).json({ error: 'Stop not found' });
    }

    res.status(200).json(updatedStop);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Failed to update stop' });
  }
});

// Delete a stop
app.delete('/api/stops/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStop = await Stop.findByIdAndDelete(id);

    if (!deletedStop) {
      return res.status(404).json({ error: 'Stop not found' });
    }

    res.status(204).send(); // Successfully deleted, no content
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ error: 'Failed to delete stop' });
  }
});

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})  
