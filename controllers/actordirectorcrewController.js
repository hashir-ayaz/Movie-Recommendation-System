const ActorDirectorCrew = require("../models/ActorDirectorCrew");
const Movie = require("../models/Movie");

// Create a new actor/director/crew member
exports.createActorDirectorCrew = async (req, res) => {
  try {
    const { name, biography, filmography, awards, photos } = req.body;

    const newActorDirectorCrew = new ActorDirectorCrew({
      name,
      biography,
      filmography,
      awards,
      photos,
    });

    const savedActorDirectorCrew = await newActorDirectorCrew.save();

    res.status(201).json({
      message: "Actor/Director/Crew created successfully",
      data: savedActorDirectorCrew,
    });
  } catch (error) {
    console.error("Error creating actor/director/crew:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get all actor/director/crew members
exports.getAllActorDirectorCrew = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const actorsDirectorsCrew = await ActorDirectorCrew.find()
      .populate("filmography", "title releaseDate")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ActorDirectorCrew.countDocuments();

    res.status(200).json({
      data: actorsDirectorsCrew,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching actor/director/crew:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get a single actor/director/crew member by ID
exports.getActorDirectorCrewById = async (req, res) => {
  try {
    const { id } = req.params;

    const actorDirectorCrew = await ActorDirectorCrew.findById(id).populate(
      "filmography",
      "title releaseDate"
    );

    if (!actorDirectorCrew) {
      return res.status(404).json({ message: "Actor/Director/Crew not found" });
    }

    res.status(200).json({ data: actorDirectorCrew });
  } catch (error) {
    console.error("Error fetching actor/director/crew by ID:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update an actor/director/crew member
exports.updateActorDirectorCrew = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, biography, filmography, awards, photos } = req.body;

    const actorDirectorCrew = await ActorDirectorCrew.findById(id);

    if (!actorDirectorCrew) {
      return res.status(404).json({ message: "Actor/Director/Crew not found" });
    }

    // Update fields only if they are provided
    if (name) actorDirectorCrew.name = name;
    if (biography) actorDirectorCrew.biography = biography;
    if (filmography) actorDirectorCrew.filmography = filmography;
    if (awards) actorDirectorCrew.awards = awards;
    if (photos) actorDirectorCrew.photos = photos;

    const updatedActorDirectorCrew = await actorDirectorCrew.save();

    res.status(200).json({
      message: "Actor/Director/Crew updated successfully",
      data: updatedActorDirectorCrew,
    });
  } catch (error) {
    console.error("Error updating actor/director/crew:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Delete an actor/director/crew member
exports.deleteActorDirectorCrew = async (req, res) => {
  try {
    const { id } = req.params;

    const actorDirectorCrew = await ActorDirectorCrew.findByIdAndDelete(id);

    if (!actorDirectorCrew) {
      return res.status(404).json({ message: "Actor/Director/Crew not found" });
    }

    res
      .status(200)
      .json({ message: "Actor/Director/Crew deleted successfully" });
  } catch (error) {
    console.error("Error deleting actor/director/crew:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Add a movie to the filmography
exports.addMovieToFilmography = async (req, res) => {
  try {
    const { id } = req.params; // Actor/Director/Crew ID
    const { movieId } = req.body;

    const actorDirectorCrew = await ActorDirectorCrew.findById(id);
    const movie = await Movie.findById(movieId);

    if (!actorDirectorCrew) {
      return res.status(404).json({ message: "Actor/Director/Crew not found" });
    }
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    actorDirectorCrew.filmography.push(movieId);
    await actorDirectorCrew.save();

    res.status(200).json({
      message: "Movie added to filmography successfully",
      data: actorDirectorCrew,
    });
  } catch (error) {
    console.error("Error adding movie to filmography:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
