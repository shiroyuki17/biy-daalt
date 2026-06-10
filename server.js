const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const logger = require('./backend/src/utils/logger');
const db = require('./backend/src/config/db');
const { generalLimiter } = require('./backend/src/middleware/rateLimiter');
const globalErrorHandler = require('./backend/src/middleware/errorHandler');
const setupSwagger = require('./backend/src/config/swagger');
const AppError = require('./backend/src/errors/AppError');

// Route Imports
const authRoutes        = require('./backend/src/routes/authRoutes');
const gameRoutes        = require('./backend/src/routes/gameRoutes');
const guideRoutes       = require('./backend/src/routes/guideRoutes');
const adminRoutes       = require('./backend/src/routes/adminRoutes');
const userRoutes        = require('./backend/src/routes/userRoutes');
const editorRoutes      = require('./backend/src/routes/editorRoutes');
const gameContentRoutes = require('./backend/src/routes/gameContentRoutes');


const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS Protection
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite frontend
    'http://localhost:3000',  // Same-origin (for api-docs)
    process.env.ALLOWED_ORIGIN
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Request Logging (Morgan + Winston)
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// 4. Rate Limiting (General API)
app.use(generalLimiter);

// 5. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Swagger API Documentation
setupSwagger(app);

// 7. Mount API Routes
app.use('/api/auth',      authRoutes);
app.use('/api/games',     gameRoutes);
app.use('/api/guides',    guideRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/users',     userRoutes);        // USER: profile, Ó©Ó©Ñ€Ð¸Ð¹Ð½ guides
app.use('/api/editor',    editorRoutes);      // EDITOR: guide/game ÑƒÐ´Ð¸Ñ€Ð´Ð°Ñ…
app.use('/api',           gameContentRoutes); // /api/champions, /api/items, /api/runes


// 8. Serve Frontend Static Files in Production
if (process.env.NODE_ENV === 'production') {
  // Check if JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    logger.warn('JWT_SECRET environment variable is not set! Using default secret key. Please set this in production.');
  }

  // Serve build static files
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

  // Handled API routes are already declared. If a route starts with /api but wasn't caught, return 404
  app.all(/^\/api\/.*$/, (req, res, next) => {
    next(new AppError(`API route ${req.originalUrl} not found`, 404));
  });

  // Serve React App for any other requests (SPA fallback)
  app.get(/^\/(.*)$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
  });
} else {
  // In development, handle unhandled API/web routes with 404
  app.all(/^\/(.*)$/, (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
  });
}

// 9. Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.testConnection();
    logger.info('MySQL database connection verified');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error(`Unable to connect to MySQL: ${error.message}`);
    process.exit(1);
  }
};

startServer();
