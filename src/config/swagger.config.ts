import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs';
import { Express } from 'express';

export const setupSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );
};