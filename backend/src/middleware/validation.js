const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            
            return res.status(400).json({
                message: 'የተላከው መረጃ ልክ አይደለም - Validation failed',
                errors
            });
        }
        
        next();
    };
};

// Validation schemas
const authSchemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        full_name: Joi.string().min(2).max(100).required(),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
        role: Joi.string().valid('patient', 'therapist', 'receptionist', 'admin').default('patient'),
        ethiopian_id: Joi.string().optional()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    refresh: Joi.object({
        refreshToken: Joi.string().required()
    })
};

const patientSchemas = {
    updateProfile: Joi.object({
        date_of_birth: Joi.date().optional(),
        gender: Joi.string().valid('male', 'female', 'other').optional(),
        region: Joi.string().min(2).max(100).optional(),
        city: Joi.string().min(2).max(100).optional(),
        emergency_contact_name: Joi.string().min(2).max(100).optional(),
        emergency_contact_phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
        insurance_provider: Joi.string().max(100).optional(),
        insurance_id: Joi.string().max(50).optional(),
        allergies: Joi.string().max(500).optional(),
        chronic_conditions: Joi.string().max(500).optional(),
        preferred_language: Joi.string().valid('amharic', 'english', 'oromic').optional(),
        marital_status: Joi.string().valid('single', 'married', 'divorced', 'widowed').optional()
    }),

    bookAppointment: Joi.object({
        therapist_id: Joi.number().integer().required(),
        appointment_date: Joi.date().min('now').required(),
        start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        type: Joi.string().valid('initial', 'follow-up', 'emergency').default('follow-up'),
        notes: Joi.string().max(500).optional()
    })
};

const therapistSchemas = {
    updateSchedule: Joi.array().items(
        Joi.object({
            day_of_week: Joi.number().min(0).max(6).required(),
            start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
        })
    ).min(1).max(7),

    createSessionNote: Joi.object({
        appointment_id: Joi.number().integer().required(),
        subjective: Joi.string().max(2000).required(),
        objective: Joi.string().max(2000).required(),
        assessment: Joi.string().max(2000).required(),
        plan: Joi.string().max(2000).required(),
        mood_rating: Joi.number().min(1).max(10).optional(),
        anxiety_rating: Joi.number().min(1).max(10).optional(),
        sleep_quality: Joi.number().min(1).max(5).optional(),
        appetite_status: Joi.string().valid('normal', 'decreased', 'increased').optional(),
        suicidal_ideation: Joi.boolean().default(false),
        self_harm: Joi.boolean().default(false),
        medication_adherence: Joi.string().max(500).optional(),
        homework: Joi.string().max(500).optional(),
        next_session_goals: Joi.string().max(500).optional()
    }),

    requestLeave: Joi.object({
        start_date: Joi.date().required(),
        end_date: Joi.date().min(Joi.ref('start_date')).required(),
        reason: Joi.string().max(500).required()
    })
};

const adminSchemas = {
    updateUserRole: Joi.object({
        role: Joi.string().valid('patient', 'therapist', 'receptionist', 'admin').required()
    }),

    updateUserStatus: Joi.object({
        is_active: Joi.boolean().required()
    })
};

module.exports = {
    validate,
    authSchemas,
    patientSchemas,
    therapistSchemas,
    adminSchemas
};