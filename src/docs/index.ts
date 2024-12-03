import swaggerBase from './swagger.json';
import authRoutes from './routes/auth.json';
import managementRoutes from './routes/management.json';
import postRoutes from './routes/post.json';
const swaggerDocument = {
  ...swaggerBase,
  paths: {
    ...swaggerBase.paths,
    ...authRoutes,
    ...managementRoutes,
    ...postRoutes
  },
};

export default swaggerDocument;