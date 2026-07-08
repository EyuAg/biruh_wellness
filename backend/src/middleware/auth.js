const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Therapist = require('../models/Therapist');
const { logger } = require('../utils/logger');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'እባክዎ ይግቡ - Please authenticate' 
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        
        const user = await User.findById(decoded.userId);
        if (!user || !user.is_active) {
            return res.status(401).json({ 
                message: 'ተጠቃሚ አልተገኘም - User not found or inactive' 
            });
        }

        req.user = user;
        req.userId = user.id;
        req.userRole = user.role;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'የግቤት ጊዜ አልፏል - Token expired' 
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'ልክ ያልሆነ ቶከን - Invalid token' 
            });
        }
        logger.error('Authentication error:', error);
        return res.status(500).json({ 
            message: 'የስርዓት ስህተት - System error' 
        });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: 'እባክዎ ይግቡ - Please authenticate' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'ይህን ክወና ለማድረግ ፈቃድ የለዎትም - Insufficient permissions' 
            });
        }

        next();
    };
};

const authorizePatient = () => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            // Check if the patient profile belongs to the user
            const patient = await Patient.findByUserId(userId);
            if (!patient || (id && patient.id !== parseInt(id))) {
                return res.status(403).json({ 
                    message: 'ይህን የታካሚ መረጃ ማየት አይችሉም - Access denied to this patient record' 
                });
            }
            
            req.patient = patient;
            next();
        } catch (error) {
            logger.error('Patient authorization error:', error);
            return res.status(500).json({ 
                message: 'የስርዓት ስህተት - System error' 
            });
        }
    };
};

const authorizeTherapist = () => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const therapist = await Therapist.findByUserId(userId);
            
            if (!therapist) {
                return res.status(403).json({ 
                    message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found' 
                });
            }
            
            req.therapist = therapist;
            next();
        } catch (error) {
            logger.error('Therapist authorization error:', error);
            return res.status(500).json({ 
                message: 'የስርዓት ስህተት - System error' 
            });
        }
    };
};

module.exports = {
    authenticate,
    authorize,
    authorizePatient,
    authorizeTherapist
};