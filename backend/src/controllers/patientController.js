const Patient = require('../models/Patient');
const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');
const SessionNote = require('../models/SessionNote');
const { logger } = require('../utils/logger');
const { auditLogger } = require('../middleware/logging');

const getProfile = async (req, res) => {
    try {
        const patient = await Patient.findByUserId(req.user.id);
        if (!patient) {
            return res.status(404).json({
                message: 'የታካሚ መገለጫ አልተገኘም - Patient profile not found'
            });
        }
        res.json(patient);
    } catch (error) {
        logger.error('Get patient profile error:', error);
        res.status(500).json({
            message: 'መረጃ ማምጣት አልተሳካም - Failed to get profile'
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const patient = await Patient.update(req.user.id, updates);
        
        if (!patient) {
            return res.status(404).json({
                message: 'የታካሚ መገለጫ አልተገኘም - Patient profile not found'
            });
        }

        // Audit log
        await auditLogger('UPDATE', 'patients')(req, res, () => {});

        res.json({
            message: 'መገለጫ በተሳካ ሁኔታ ተዘምኗል - Profile updated successfully',
            patient
        });
    } catch (error) {
        logger.error('Update patient profile error:', error);
        res.status(500).json({
            message: 'መገለጫ ማዘመን አልተሳካም - Failed to update profile'
        });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await Patient.getAppointments(req.user.id);
        res.json(appointments);
    } catch (error) {
        logger.error('Get patient appointments error:', error);
        res.status(500).json({
            message: 'ቀጠሮዎች ማምጣት አልተሳካም - Failed to get appointments'
        });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const patient = await Patient.findByUserId(req.user.id);
        if (!patient) {
            return res.status(404).json({
                message: 'የታካሚ መገለጫ አልተገኘም - Patient profile not found'
            });
        }

        const { therapist_id, appointment_date, start_time, end_time, type, notes } = req.body;

        const appointment = await Appointment.create({
            patient_id: patient.id,
            therapist_id,
            appointment_date,
            start_time,
            end_time,
            type,
            notes
        });

        // Audit log
        await auditLogger('CREATE', 'appointments')(req, res, () => {});

        res.status(201).json({
            message: 'ቀጠሮ በተሳካ ሁኔታ ተይዟል - Appointment booked successfully',
            appointment
        });
    } catch (error) {
        logger.error('Book appointment error:', error);
        res.status(500).json({
            message: error.message || 'ቀጠሮ መያዝ አልተሳካም - Failed to book appointment'
        });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await Appointment.cancel(id, reason);
        
        if (!appointment) {
            return res.status(404).json({
                message: 'ቀጠሮ አልተገኘም - Appointment not found'
            });
        }

        // Audit log
        await auditLogger('CANCEL', 'appointments')(req, res, () => {});

        res.json({
            message: 'ቀጠሮ በተሳካ ሁኔታ ተሰርዟል - Appointment cancelled successfully',
            appointment
        });
    } catch (error) {
        logger.error('Cancel appointment error:', error);
        res.status(500).json({
            message: 'ቀጠሮ መሰረዝ አልተሳካም - Failed to cancel appointment'
        });
    }
};

const getSessionHistory = async (req, res) => {
    try {
        const notes = await Patient.getSessionNotes(req.user.id);
        // Decrypt notes for patient (show redacted version)
        const redactedNotes = notes.map(note => ({
            ...note,
            subjective: note.is_encrypted ? '🔒 የተመሰጠረ መረጃ - Encrypted' : note.subjective,
            objective: note.is_encrypted ? '🔒 የተመሰጠረ መረጃ - Encrypted' : note.objective,
            assessment: note.is_encrypted ? '🔒 የተመሰጠረ መረጃ - Encrypted' : note.assessment,
            plan: note.is_encrypted ? '🔒 የተመሰጠረ መረጃ - Encrypted' : note.plan
        }));
        res.json(redactedNotes);
    } catch (error) {
        logger.error('Get session history error:', error);
        res.status(500).json({
            message: 'የክፍለ ጊዜ ታሪክ ማምጣት አልተሳካም - Failed to get session history'
        });
    }
};

const getAvailableTherapists = async (req, res) => {
    try {
        const { date } = req.query;
        const therapists = await Therapist.getAllTherapists();
        
        // Get availability for each therapist
        const availableTherapists = [];
        for (const therapist of therapists) {
            if (date) {
                const slots = await Therapist.getAvailableSlots(therapist.id, date);
                if (slots.length > 0) {
                    availableTherapists.push({
                        ...therapist,
                        available_slots: slots
                    });
                }
            } else {
                availableTherapists.push(therapist);
            }
        }

        res.json(availableTherapists);
    } catch (error) {
        logger.error('Get available therapists error:', error);
        res.status(500).json({
            message: 'የሳይኮሎጂስቶች መረጃ ማምጣት አልተሳካም - Failed to get therapists'
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAppointments,
    bookAppointment,
    cancelAppointment,
    getSessionHistory,
    getAvailableTherapists
};