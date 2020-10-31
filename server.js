const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

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

app.put("/api/workouts/:id", (req, res) => {
  let workoutID = req.params.id;
  let newExercise = req.body;
  db.Workout.findByIdAndUpdate(workoutID, {$push: {exercises: newExercise}}, (err, found) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(found);
      res.status(200).json(found);
    }
  });
});

app.post("/api/workouts", (req, res) => {
  db.Workout.create(req.body).then((workout) => {
    console.log("post successful");
    res.json(workout);
  }).catch((err) => {
    res.json(err);
  });
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({}).limit(7).then((data) => {
    console.log(data);
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});





app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });