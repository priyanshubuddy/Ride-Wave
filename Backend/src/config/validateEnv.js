const { logger } = require('./logger');

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT'
];

const validateEnv = () => {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Validate JWT_SECRET specifically
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    const errorMessage = 'JWT_SECRET must be at least 32 characters long';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info('Environment variables validated successfully');
};

module.exports = validateEnv; 