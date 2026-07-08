const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { logger, stream } = require('./utils/logger');
const { requestLogger } = require('./middleware/logging');
const { authenticate } = require('./middleware/auth');
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const ensureSeedData = async () => {
    try {
        const bcrypt = require('bcrypt');
        const { query } = require('./config/database');

        const defaultPassword = process.env.DEFAULT_USER_PASSWORD || 'Admin@123';
        const defaults = [
            { email: 'admin@biruhwellness.com', name: 'System Admin', role: 'admin', student_id: 'ADM-001' },
            { email: 'therapist@biruhwellness.com', name: 'Dr. Selam Bekele', role: 'therapist', student_id: 'TH-001' },
            { email: 'patient@biruhwellness.com', name: 'Tigist Alemu', role: 'patient', student_id: 'PT-001' },
            { email: 'alemayehu@biruhwellness.com', name: 'Dr. Alemayehu Tesfaye', role: 'therapist', student_id: 'TH-002' },
            { email: 'mahebereselam@biruhwellness.com', name: 'Dr. Mahebereselam Aregay', role: 'therapist', student_id: 'TH-003' },
            { email: 'fikre@biruhwellness.com', name: 'Dr. Fikre Desalegn', role: 'therapist', student_id: 'TH-004' },
            { email: 'hliti@biruhwellness.com', name: 'W/ro Hliti Gebreselassie', role: 'therapist', student_id: 'TH-005' },
            { email: 'tesfaye@biruhwellness.com', name: 'Dr. Tesfaye Woldemariam', role: 'therapist', student_id: 'TH-006' },
            { email: 'selam.h@biruhwellness.com', name: 'W/ro Selam Hailemariam', role: 'therapist', student_id: 'TH-007' },
            { email: 'haylu@biruhwellness.com', name: 'Dr. Haylu Asefa', role: 'therapist', student_id: 'TH-008' },
            { email: 'ehet@biruhwellness.com', name: 'W/ro Ehet Abraham', role: 'therapist', student_id: 'TH-009' },
            { email: 'yosef@biruhwellness.com', name: 'Dr. Yosef Tadesse', role: 'therapist', student_id: 'TH-010' },
            { email: 'samira@biruhwellness.com', name: 'W/ro Samira Gebremedhin', role: 'therapist', student_id: 'TH-011' },
            { email: 'tigist@email.com', name: 'Tigist Desta', role: 'patient', student_id: 'PT-002' },
            { email: 'dawit@email.com', name: 'Dawit Mekonnen', role: 'patient', student_id: 'PT-003' },
            { email: 'ruth@email.com', name: 'Ruth Hailemariam', role: 'patient', student_id: 'PT-004' },
            { email: 'samuel@email.com', name: 'Samuel Tesfaye', role: 'patient', student_id: 'PT-005' },
            { email: 'kidist@email.com', name: 'Kidist Alemu', role: 'patient', student_id: 'PT-006' },
            { email: 'abiy.a@email.com', name: 'Abiy Abebe', role: 'patient', student_id: 'PT-007' },
            { email: 'henok@email.com', name: 'Henok Gebreegziabher', role: 'patient', student_id: 'PT-008' },
            { email: 'zemen@email.com', name: 'Zemen Meles', role: 'patient', student_id: 'PT-009' },
            { email: 'meron@email.com', name: 'Meron Tekle', role: 'patient', student_id: 'PT-010' },
            { email: 'eden@email.com', name: 'Eden Girmay', role: 'patient', student_id: 'PT-011' },
            { email: 'nathan@email.com', name: 'Nathan Berhanu', role: 'patient', student_id: 'PT-012' },
            { email: 'sara@email.com', name: 'Sara Hailu', role: 'patient', student_id: 'PT-013' }
        ];

        const passwordHash = await bcrypt.hash(defaultPassword, 12);

        for (const user of defaults) {
            const existing = await query('SELECT id FROM users WHERE email = $1', [user.email]);

            if (existing.rows.length > 0) {
                await query(
                    `UPDATE users
                     SET name = $1, role = $2, student_id = $3, password_hash = $4, is_active = true, updated_at = CURRENT_TIMESTAMP
                     WHERE email = $5`,
                    [user.name, user.role, user.student_id, passwordHash, user.email]
                );
                continue;
            }

            await query(
                `INSERT INTO users (name, email, password_hash, role, student_id, is_active)
                 VALUES ($1, $2, $3, $4, $5, true)`,
                [user.name, user.email, passwordHash, user.role, user.student_id]
            );
        }

        // Ensure therapist profiles exist for every active therapist user
        try {
            const therapistUsers = await query("SELECT id, name, email FROM users WHERE role = 'therapist' AND is_active = true");
            for (const tu of therapistUsers.rows) {
                const tExists = await query('SELECT id FROM therapists WHERE user_id = $1', [tu.id]);
                if (tExists.rows.length === 0) {
                    await query(
                        `INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio, availability_description)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [tu.id, 'LIC-' + String(tu.id).padStart(4, '0'), 'General Mental Health', 500, 5, 'MSc Clinical Psychology', `Demo profile for ${tu.name}`, 'Mon-Fri 09:00-17:00']
                    );
                }
            }
        } catch (err) {
            logger.warn('Therapist profile creation skipped:', err.message);
        }

        // Ensure patient profiles exist for every active patient user
        try {
            const patientUsers = await query("SELECT id, name, email FROM users WHERE role = 'patient' AND is_active = true");
            for (const pu of patientUsers.rows) {
                const pExists = await query('SELECT id FROM patients WHERE user_id = $1', [pu.id]);
                if (pExists.rows.length === 0) {
                    await query(
                        `INSERT INTO patients (user_id, date_of_birth, gender, region, city, preferred_language, marital_status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [pu.id, '1990-01-01', 'female', 'Addis Ababa', 'Addis Ababa', 'amharic', 'single']
                    );
                }
            }
        } catch (err) {
            logger.warn('Patient profile creation skipped:', err.message);
        }
    } catch (error) {
        logger.warn('Seed initialization skipped:', error.message);
    }
};

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan('combined', { stream }));
app.use(requestLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API routes
app.use('/api/auth', rateLimiter.loginLimiter, authRoutes);
app.use('/api/patients', authenticate, patientRoutes);
app.use('/api/therapists', authenticate, therapistRoutes);
app.use('/api/appointments', authenticate, appointmentRoutes);
app.use('/api/admin', authenticate, adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'የተጠየቀው መንገድ አልተገኘም - Resource not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        user: req.user ? req.user.id : 'anonymous'
    });

    const status = err.status || 500;
    const message = err.message || 'የውስጥ የአገልግሎት ስህተት - Internal server error';

    res.status(status).json({
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
if (require.main === module) {
    const startServer = (port) => {
        const server = app.listen(port, () => {
            logger.info(`🚀 Biruh Wellness server running on port ${port}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.warn(`Port ${port} is busy, trying ${port + 1}`);
                server.close(() => startServer(port + 1));
            } else {
                logger.error('Server failed to start:', error);
                process.exit(1);
            }
        });

        process.on('SIGTERM', () => {
            logger.info('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                logger.info('HTTP server closed');
                process.exit(0);
            });
        });
    };

    const requestedPort = Number(process.env.PORT) || 5000;
    ensureSeedData().finally(() => startServer(requestedPort));
}

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;