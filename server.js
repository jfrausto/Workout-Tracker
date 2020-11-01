// dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

// reference to the workout models
let db = require("./models/");
// port constant depending on environment
const PORT = process.env.PORT || 3000;
// instantiate express
const app = express();
// middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// connect to mongo db
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// get request for most recent workout
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

// update request to add a new exercise to a Workout
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

// post request to make a new Workout
app.post("/api/workouts", (req, res) => {
  db.Workout.create(req.body).then((workout) => {
    console.log("post successful");
    res.json(workout);
  }).catch((err) => {
    res.json(err);
  });
});

// get request to get 7 most recent workouts
app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({}).limit(7).then((data) => {
    console.log(data);
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// HTML get requests for each html file
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

// start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });