const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "MERN API Documentation",
    version: "1.0.0",
    description: "API documentation for the MERN backend",
  },
  servers: [
    {
      url: "http://localhost:3000", // Replace with your API URL
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Unique identifier for the user",
            example: "60d0fe4f5311236168a109ca",
          },
          username: {
            type: "string",
            description: "The user's username",
            example: "johndoe",
          },
          email: {
            type: "string",
            format: "email",
            description: "The user's email address",
            example: "johndoe@example.com",
          },
          password: {
            type: "string",
            format: "password",
            description: "The user's password (only for requests)",
            example: "securepassword123",
          },
          profilePhoto: {
            type: "string",
            format: "url",
            description: "URL of the user's profile photo",
            example: "https://example.com/photo.jpg",
          },
          moviePreferences: {
            type: "object",
            properties: {
              genre: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of preferred genres",
                example: ["Action", "Comedy"],
              },
              director: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of preferred directors",
                example: ["Christopher Nolan"],
              },
              actor: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of preferred actors",
                example: ["Leonardo DiCaprio"],
              },
            },
          },
          personalWishlist: {
            type: "array",
            items: {
              type: "string",
              description: "Movie ID",
            },
            description: "List of movies in the user's wishlist",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "The date when the user was created",
            example: "2023-01-01T00:00:00.000Z",
          },
          lists: {
            type: "array",
            items: {
              type: "string",
              description: "List ID",
            },
            description: "List of lists created by the user",
          },
          followedLists: {
            type: "array",
            items: {
              type: "string",
              description: "List ID",
            },
            description: "List of lists followed by the user",
          },
          role: {
            type: "string",
            enum: ["user", "admin"],
            description: "The user's role in the system",
            example: "user",
          },
        },
      },
      Movie: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the movie",
            example: "Inception",
          },
          genre: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of genres for the movie",
            example: ["Action", "Sci-Fi"],
          },
          director: {
            type: "string",
            description: "ID of the director (reference to ActorDirectorCrew)",
            example: "60d0fe4f5311236168a109ca",
          },
          cast: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of actor IDs (references to ActorDirectorCrew)",
            example: ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc"],
          },
          imdbRating: {
            type: "number",
            description: "IMDB rating of the movie",
            example: 8.8,
          },
          releaseDate: {
            type: "string",
            format: "date",
            description: "Release date of the movie",
            example: "2010-07-16",
          },
          runtime: {
            type: "number",
            description: "Runtime of the movie in minutes",
            example: 148,
          },
          synopsis: {
            type: "string",
            description: "Synopsis of the movie",
            example:
              "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into a target's subconscious.",
          },
          averageRating: {
            type: "number",
            description: "Average user rating for the movie",
            example: 4.5,
          },
          coverPhoto: {
            type: "string",
            format: "url",
            description: "URL of the movie's cover photo",
            example: "https://example.com/inception.jpg",
          },
          trivia: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of trivia facts about the movie",
            example: [
              "The spinning top was a real prop.",
              "Most of the scenes were shot in real locations.",
            ],
          },
          goofs: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of goofs or errors in the movie",
            example: [
              "In one scene, the character is seen wearing a different tie.",
            ],
          },
          soundtrack: {
            type: "string",
            description: "Details about the movie's soundtrack",
            example: "Hans Zimmer composed the score for the movie.",
          },
          ageRating: {
            type: "number",
            description: "Age rating for the movie",
            example: 13,
          },
          parentalGuidance: {
            type: "string",
            description: "Parental guidance information for the movie",
            example: "Contains strong language and violence.",
          },
          reviews: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of review IDs (references to Review)",
            example: ["60d0fe4f5311236168a109cd", "60d0fe4f5311236168a109ce"],
          },
          boxOffice: {
            type: "object",
            properties: {
              openingWeekend: {
                type: "number",
                description: "Opening weekend box office earnings",
                example: 62000000,
              },
              totalDomestic: {
                type: "number",
                description: "Total domestic box office earnings",
                example: 292000000,
              },
              totalInternational: {
                type: "number",
                description: "Total international box office earnings",
                example: 534000000,
              },
              totalWorldwide: {
                type: "number",
                description: "Total worldwide box office earnings",
                example: 826000000,
              },
            },
            description: "Box office information for the movie",
          },
          awards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the award",
                  example: "Oscar",
                },
                category: {
                  type: "string",
                  description: "Award category",
                  example: "Best Picture",
                },
                year: {
                  type: "number",
                  description: "Year the award was won or nominated",
                  example: 2011,
                },
                won: {
                  type: "boolean",
                  description: "Whether the award was won",
                  example: true,
                },
              },
            },
            description: "List of awards and nominations for the movie",
          },
          countryOfOrigin: {
            type: "string",
            description: "Country where the movie was produced",
            example: "United States",
          },
          language: {
            type: "string",
            description: "Language of the movie",
            example: "English",
          },
          keywords: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Keywords for advanced filtering",
            example: ["dream", "heist", "sci-fi"],
          },
          similarTitles: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of IDs for similar movies",
            example: ["60d0fe4f5311236168a109cf", "60d0fe4f5311236168a109d0"],
          },
        },
      },
      Article: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Unique identifier for the article",
            example: "60d0fe4f5311236168a109ca",
          },
          title: {
            type: "string",
            description: "Title of the article",
            example: "New Insights into Movie Recommendations",
          },
          content: {
            type: "string",
            description: "Content of the article",
            example:
              "This article explores advanced techniques for improving movie recommendation systems...",
          },
          category: {
            type: "string",
            enum: ["Movies", "Actors", "Upcoming Projects", "Industry Updates"],
            description: "Category of the article",
            example: "Movies",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Tags associated with the article for filtering and searching",
            example: ["Recommendation", "AI", "Machine Learning"],
          },
          author: {
            type: "string",
            description: "ID of the user/admin who created the article",
            example: "60d0fe4f5311236168a109cb",
          },
          publishedAt: {
            type: "string",
            format: "date-time",
            description: "Publication date of the article",
            example: "2024-04-01T12:00:00.000Z",
          },
          coverImage: {
            type: "string",
            format: "url",
            description: "URL to the cover image of the article",
            example: "https://example.com/cover-image.jpg",
          },
          views: {
            type: "number",
            description: "Number of views the article has received",
            example: 1500,
          },
          isPublished: {
            type: "boolean",
            description: "Flag indicating whether the article is published",
            example: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Creation timestamp of the article",
            example: "2024-03-25T10:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp of the article",
            example: "2024-03-30T15:30:00.000Z",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Error message detailing what went wrong",
            example: "Invalid Movie ID",
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
