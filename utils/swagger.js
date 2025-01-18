import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app) => {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for my API",
    },
    servers: [
      {
        url: "/api", 
        description: "Base path for all API routes",
      },
    ],
  };

  const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"],
  };

  const swaggerSpec = swaggerJsDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
