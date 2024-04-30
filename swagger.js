import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
const setup = swaggerUi.setup(swaggerSpec);

export default {
    serve,
    setup
};
