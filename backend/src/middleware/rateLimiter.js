const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        message: 'በጣም ብዙ ጥያቄዎች - Too many requests, please try again later'
    }
});

// Login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // 10 login attempts
    message: {
        message: 'በጣም ብዙ የመግቢያ ሙከራዎች - Too many login attempts, please try again after 15 minutes'
    }
});

// Registration rate limiter
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 registrations per hour
    message: {
        message: 'በጣም ብዙ የምዝገባ ሙከራዎች - Too many registration attempts, please try again later'
    }
});

module.exports = {
    generalLimiter,
    loginLimiter,
    registerLimiter
};