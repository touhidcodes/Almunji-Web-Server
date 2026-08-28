import swaggerJsdoc from "swagger-jsdoc";

const devUrl = process.env.SWAGGER_DEV_URL || "http://localhost:5000";
const prodUrl = process.env.PROD_API_URL || "https://api.almunji.com";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Almunji Web API",
      version: "1.0.0",
      description: [
        "API documentation for Almunji Web Server with JWT Bearer authentication",
        "",
        "## Authentication",
        "1. Click the \"Authorize\" button below",
        "2. Enter your token in the format: **Bearer <token>**",
        "3. All requests will now include your authorization token",
        "",
        "## How to get a token",
        "1. Login via `/api/v1/auth/login` with your credentials",
        "2. Copy the `accessToken` from the response",
        "3. Use it in Swagger UI's authorize dialog",
      ].join("\n"),
    },
    servers: [
      {
        url: devUrl,
        description: "Development server",
      },
      {
        url: prodUrl,
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
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
