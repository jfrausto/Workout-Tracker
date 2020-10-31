const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

let db = require("./models/");


const PORT = process.env.PORT || 3000;

// const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.get("/api/workouts", (req, res) => {
  db.Workout.find().sort({ _id: -1}).limit(1).exec((err, found) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(found);
      res.send(found);
    }
  });
});



app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });