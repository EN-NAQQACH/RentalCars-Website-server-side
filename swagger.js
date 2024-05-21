import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Quiz API',
            version: '1.3.1',
            description: 'API for the EaslyCars website',
        },
    },
    apis: ["./server/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const serve = swaggerUi.serve;
const setup = swaggerUi.setup(swaggerSpec, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
});

export default {
    serve,
    setup
};
