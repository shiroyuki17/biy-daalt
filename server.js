const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const logger = require('./backend/src/utils/logger');
const { generalLimiter } = require('./backend/src/middleware/rateLimiter');
const globalErrorHandler = require('./backend/src/middleware/errorHandler');
const setupSwagger = require('./backend/src/config/swagger');
const AppError = require('./backend/src/errors/AppError');

// Route Imports
const authRoutes   = require('./backend/src/routes/authRoutes');
const gameRoutes   = require('./backend/src/routes/gameRoutes');
const guideRoutes  = require('./backend/src/routes/guideRoutes');
const adminRoutes  = require('./backend/src/routes/adminRoutes');
const userRoutes   = require('./backend/src/routes/userRoutes');
const editorRoutes = require('./backend/src/routes/editorRoutes');

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
app.use('/api/auth',   authRoutes);
app.use('/api/games',  gameRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/admin',  adminRoutes);
app.use('/api/users',  userRoutes);   // USER: profile, өөрийн guides
app.use('/api/editor', editorRoutes); // EDITOR: guide/game удирдах

// 8. Handle Unhandled Routes
app.all('/{*any}', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// 9. Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
