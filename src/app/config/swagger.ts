import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Almunji Web API",
      version: "1.0.0",
      description:
        "API documentation for Almunji Web Server with JWT Bearer authentication",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: process.env.PROD_API_URL || "https://almunji.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/app/router/routes.ts", "./src/app/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
