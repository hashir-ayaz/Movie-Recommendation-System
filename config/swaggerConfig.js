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
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Path to the API docs (adjust as needed)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
