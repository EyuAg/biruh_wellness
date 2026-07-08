const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const { authSchemas } = require('../middleware/validation');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

router.post(
    '/register',
    registerLimiter,
    validate(authSchemas.register),
    authController.register  
);

router.post(
    '/login',
    loginLimiter,
    validate(authSchemas.login),
    authController.login  
);

router.post(
    '/refresh',
    validate(authSchemas.refresh),
    authController.refreshToken  
);

router.post(
    '/logout',
    authController.logout  
);

router.post(
    '/forgot-password',
    authController.forgotPassword 
);

router.post(
    '/reset-password/:token',
    authController.resetPassword  
);

module.exports = router;