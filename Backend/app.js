const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
const port = 3000;

const stopRouter=require("./routes/admin/stop.js")

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

app.use("/admin/stops",stopRouter);

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})  
