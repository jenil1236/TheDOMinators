//Not required

const express = require("express");
const router = express.Router();
const axios=require("axios");

// Route: Form Submit
router.post("/", async (req, res) => {
  const { question } = req.body;

  try {
    const apiResponse = await axios.post("http://localhost:8000/ask", {
      question: question,
    });

    // ✅ Access the JSON data correctly
    res.status(200).send(apiResponse.data);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;