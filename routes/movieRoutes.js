const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Public Routes (Specific Routes First)
router.get("/search-filter", movieController.searchAndFilterMovies); // Search and filter movies
router.get("/top-of-month", movieController.getTopMoviesOfTheMonth); // Top movies of the month
router.get("/top-by-genre", movieController.getTopMoviesByGenre); // Top 10 movies by genre
router.get("/:movieId/similar-titles", movieController.getSimilarTitles); // Top 10 movies

// Dynamic Routes for Public Access
router.get("/:id/reviews", movieController.getReviews); // Get reviews for a movie
router.get("/:id", movieController.getMovie); // Get details of a single movie

// Admin Routes (Protected)
router.get("/", protect, adminProtect, movieController.getMovies); // Get all movies
router.post("/", protect, adminProtect, movieController.addMovie); // Add a new movie
router.patch("/:id", protect, adminProtect, movieController.updateMovie); // Update a movie
router.delete("/:id", protect, adminProtect, movieController.deleteMovie); // Delete a movie

// Review Routes
router
  .post("/:movieId/review", protect, movieController.addReview) // Add a movie review
  .post("/:reviewId/like", protect, movieController.likeReview); // Like a movie review

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management and operations
 */

/**
 * @swagger
 * /api/v1/movies/search-filter:
 *   get:
 *     summary: Search and filter movies based on various criteria
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query for movies
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum IMDB rating
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Maximum IMDB rating
 *       - in: query
 *         name: minYear
 *         schema:
 *           type: number
 *         description: Minimum release year
 *       - in: query
 *         name: maxYear
 *         schema:
 *           type: number
 *         description: Maximum release year
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Genre to filter by
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: List of filtered movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request due to invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/top-of-month:
 *   get:
 *     summary: Get top movies of the current month based on IMDB rating
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Top movies of the month retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/top-by-genre:
 *   get:
 *     summary: Get top 10 movies by specified genre based on IMDB rating
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Genre to filter top movies by
 *     responses:
 *       200:
 *         description: Top movies by genre retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Genre parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{movieId}/similar-titles:
 *   get:
 *     summary: Get similar movie titles based on genres, director, or IMDB rating
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to find similar titles for
 *     responses:
 *       200:
 *         description: Similar titles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Similar titles fetched successfully
 *                 similarTitles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{id}/reviews:
 *   get:
 *     summary: Get all reviews for a specific movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to retrieve reviews for
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid movie ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   get:
 *     summary: Get details of a single movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to retrieve
 *     responses:
 *       200:
 *         description: Movie details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: Retrieve a list of all movies (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all movies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Add a new movie (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Movie details to add
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie added successfully
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     summary: Update a movie by ID (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to update
 *     requestBody:
 *       required: true
 *       description: Movie fields to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi"]
 *               director:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc"]
 *               imdbRating:
 *                 type: number
 *                 example: 8.8
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2010-07-16
 *               runtime:
 *                 type: number
 *                 example: 148
 *               synopsis:
 *                 type: string
 *                 example: A thief who steals corporate secrets...
 *               averageRating:
 *                 type: number
 *                 example: 4.5
 *               coverPhoto:
 *                 type: string
 *                 format: url
 *                 example: https://example.com/inception.jpg
 *               trivia:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["The spinning top was a real prop."]
 *               goofs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["In one scene, the character is seen wearing a different tie."]
 *               soundtrack:
 *                 type: string
 *                 example: Hans Zimmer composed the score.
 *               ageRating:
 *                 type: number
 *                 example: 13
 *               parentalGuidance:
 *                 type: string
 *                 example: Contains strong language and violence.
 *               boxOffice:
 *                 type: object
 *                 properties:
 *                   openingWeekend:
 *                     type: number
 *                     example: 62000000
 *                   totalDomestic:
 *                     type: number
 *                     example: 292000000
 *                   totalInternational:
 *                     type: number
 *                     example: 534000000
 *                   totalWorldwide:
 *                     type: number
 *                     example: 826000000
 *               awards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Oscar
 *                     category:
 *                       type: string
 *                       example: Best Picture
 *                     year:
 *                       type: number
 *                       example: 2011
 *                     won:
 *                       type: boolean
 *                       example: true
 *               countryOfOrigin:
 *                 type: string
 *                 example: United States
 *               language:
 *                 type: string
 *                 example: English
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["dream", "heist", "sci-fi"]
 *               similarTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d0fe4f5311236168a109cf", "60d0fe4f5311236168a109d0"]
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie updated successfully
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID or input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie deleted successfully
 *       400:
 *         description: Invalid movie ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   patch:
 *     summary: Update a movie by ID (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to update
 *     requestBody:
 *       required: true
 *       description: Movie fields to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi"]
 *               director:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc"]
 *               imdbRating:
 *                 type: number
 *                 example: 8.8
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2010-07-16
 *               runtime:
 *                 type: number
 *                 example: 148
 *               synopsis:
 *                 type: string
 *                 example: A thief who steals corporate secrets...
 *               averageRating:
 *                 type: number
 *                 example: 4.5
 *               coverPhoto:
 *                 type: string
 *                 format: url
 *                 example: https://example.com/inception.jpg
 *               trivia:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["The spinning top was a real prop."]
 *               goofs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["In one scene, the character is seen wearing a different tie."]
 *               soundtrack:
 *                 type: string
 *                 example: Hans Zimmer composed the score.
 *               ageRating:
 *                 type: number
 *                 example: 13
 *               parentalGuidance:
 *                 type: string
 *                 example: Contains strong language and violence.
 *               boxOffice:
 *                 type: object
 *                 properties:
 *                   openingWeekend:
 *                     type: number
 *                     example: 62000000
 *                   totalDomestic:
 *                     type: number
 *                     example: 292000000
 *                   totalInternational:
 *                     type: number
 *                     example: 534000000
 *                   totalWorldwide:
 *                     type: number
 *                     example: 826000000
 *               awards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Oscar
 *                     category:
 *                       type: string
 *                       example: Best Picture
 *                     year:
 *                       type: number
 *                       example: 2011
 *                     won:
 *                       type: boolean
 *                       example: true
 *               countryOfOrigin:
 *                 type: string
 *                 example: United States
 *               language:
 *                 type: string
 *                 example: English
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["dream", "heist", "sci-fi"]
 *               similarTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d0fe4f5311236168a109cf", "60d0fe4f5311236168a109d0"]
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie updated successfully
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID or input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie deleted successfully
 *       400:
 *         description: Invalid movie ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   patch:
 *     summary: Update a movie by ID (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to update
 *     requestBody:
 *       required: true
 *       description: Movie fields to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie updated successfully
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID or input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{movieId}/review:
 *   post:
 *     summary: Add a review to a specific movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to add a review to
 *     requestBody:
 *       required: true
 *       description: Review details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ratingValue
 *               - reviewText
 *             properties:
 *               ratingValue:
 *                 type: number
 *                 example: 4.5
 *               reviewText:
 *                 type: string
 *                 example: "Amazing movie with a mind-bending plot!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review added successfully
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *                 averageRating:
 *                   type: number
 *                   example: 4.5
 *       400:
 *         description: Invalid movie ID or input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/movies/{reviewId}/like:
 *   post:
 *     summary: Like a specific movie review
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to like
 *     responses:
 *       200:
 *         description: Review liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review liked successfully
 *       400:
 *         description: Invalid review ID or review already liked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
