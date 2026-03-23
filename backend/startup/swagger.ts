import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

export default (app: any) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Library API',
        version: '1.0.0',
        description: 'A simple Express Library API',
      },
      servers: [
        {
          url: process.env.BACKEND_URL || 'http://localhost:3001',
        },
      ],
    },
    apis: ['./routes/*.ts'],
  };

  const specs = swaggerJsDoc(options);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
};
