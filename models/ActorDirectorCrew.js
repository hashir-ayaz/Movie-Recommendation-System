const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActorDirectorCrewSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  biography: {
    type: String,
    required: [true, "Biography is required"],
  },
  filmography: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
  awards: [
    {
      awardName: {
        type: String,
        required: [true, "Award name is required"],
      },
      year: {
        type: Number,
        required: [true, "Award year is required"],
      },
    },
  ],
  photos: [
    {
      type: String, // URL or path to the photo
      required: [true, "Photo URL is required"],
    },
  ],
  searchedTimes: {
    type: Number,
    default: 0,
  },
});

const ActorDirectorCrew = mongoose.model(
  "ActorDirectorCrew",
  ActorDirectorCrewSchema
);

module.exports = ActorDirectorCrew;
