const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    day: { type: Date, default: Date.now },
    exercises: [{
        type: { type: String },
        name: String,
        duration: Number,
        weight: Number,
        reps: Number,
        sets: Number,
        distance: Number
        }]
  }, {
      toObject: {virtuals: true},
      toJSON: {virtuals: true}
  }
  );
  
  WorkoutSchema.virtual("totalDuration").get(function(){
    let total = 0;
    for (let i = 0; i < this.exercises.length; i++){
        total = total + this.exercises[i].duration;
    }
    return total;
  });

  const Workout = mongoose.model("Workout", WorkoutSchema);
  
  module.exports = Workout;
  