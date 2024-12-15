# Movie Recommendation System

The **Movie Recommendation System** is a platform designed to enhance the user experience by offering personalized movie recommendations, user forums, and detailed movie information. This project enables users to explore trending movies, create watchlists, review films, and interact with others through forums.

---

## Features

### 1. **User Management**
- **Authentication**: Users can register, log in, and update their profiles.
- **Personalized Recommendations**: Users receive movie recommendations based on preferences like genre, actors, and directors.
- **Watchlists**: Create and manage custom movie lists.
- **Wishlist**: Add movies to a personal wishlist for future reference.

### 2. **Movie Information**
- View detailed movie information, including cast, crew, and ratings.
- Search and filter movies by title, genre, release year, and IMDb rating.
- Browse top-rated movies, trending titles, and genre-specific recommendations.

### 3. **Reviews and Ratings**
- Submit and manage reviews for movies.
- Like and dislike reviews.
- View movie ratings and contribute your own.

### 4. **Forums**
- Engage in discussions about movies in community forums.
- Create posts, comment, and upvote/downvote contributions.
- Join and leave forums as per interest.

### 5. **Admin Panel**
- Monitor platform activity with access to:
  - Most liked posts and reviews.
  - Forums with the most members or posts.
  - Popular movies by IMDb rating.
- Manage user reports and platform moderation tasks.

---

## Project Structure

### Directory Layout
```
hashir-ayaz-Movie-Recommendation-System/
├── controllers/        # Business logic for different modules
├── populateDB/         # Scripts and data for populating the database
├── services/           # Helper services like reminders
├── config/             # Configuration files (DB, Swagger)
├── routes/             # API routes
├── middleware/         # Middleware for error handling and authentication
├── models/             # Mongoose schemas for database collections
├── utils/              # Utility functions (auth, email, etc.)
├── app.js              # Main Express application file
├── server.js           # Server entry point
└── package.json        # Project dependencies and metadata
```

---

## API Endpoints

### Authentication
- **POST** `/api/v1/auth/register`: Register a new user.
- **POST** `/api/v1/auth/login`: Log in a user.

### Movies
- **GET** `/api/v1/movies`: Fetch movies with optional filters.
- **POST** `/api/v1/movies`: Add a new movie (Admin).
- **PUT** `/api/v1/movies/:id`: Update movie details (Admin).
- **DELETE** `/api/v1/movies/:id`: Delete a movie (Admin).

### Reviews
- **POST** `/api/v1/movies/:id/reviews`: Add a review for a movie.
- **GET** `/api/v1/movies/:id/reviews`: Get reviews for a movie.
- **POST** `/api/v1/reviews/:id/like`: Like a review.

### Forums
- **GET** `/api/v1/forums`: List all forums.
- **POST** `/api/v1/forums`: Create a new forum.
- **GET** `/api/v1/forums/:id`: View details of a specific forum.

---

## Technology Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based
- **API Documentation**: Swagger
- **Email Service**: Nodemailer

---

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **MongoDB**: A running MongoDB instance.
- **Environment Variables**: Set up a `.env` file with the following keys:
  ```
  MONGO_URI=<your-mongo-db-uri>
  JWT_SECRET=<your-jwt-secret>
  PORT=3000
  ```

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hashir-ayaz-Movie-Recommendation-System
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

---

## Contribution Guidelines

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push:
   ```bash
   git push origin feature-name
   ```
4. Open a pull request.

---

## License

This project is licensed under the MIT License.

