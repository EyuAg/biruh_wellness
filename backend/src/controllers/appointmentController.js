const { query } = require('../config/database');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Therapist = require('../models/Therapist');
const { createTimeSlots } = require('../services/schedulingService');
const { logger } = require('../utils/logger');

const validateAppointmentPayload = (payload) => {
    const { therapist_id, appointment_date, start_time, end_time } = payload;

    if (!therapist_id || !appointment_date || !start_time || !end_time) {
        const error = new Error('ቀጠሮ መረጃ አልተሞላም - Missing required appointment details');
        error.status = 400;
        throw error;
    }

    if (start_time >= end_time) {
        const error = new Error('የመጀመሪያ ጊዜ ከመጨረሻው ጊዜ ሊበልጥ ይገባል - Start time must be before end time');
        error.status = 400;
        throw error;
    }
};

const isTimeSlotAvailable = (slotStart, slotEnd, existingAppointments) => {
    return !existingAppointments.some((appointment) => {
        const existingStart = appointment.start_time;
        const existingEnd = appointment.end_time;

        return slotStart < existingEnd && slotEnd > existingStart;
    });
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                message: 'ቀጠሮ አልተገኘም - Appointment not found'
            });
        }

        const userId = req.user.id;
        const role = req.user.role;

        if (role === 'admin' || role === 'receptionist') {
            return res.json(appointment);
        }

        if (role === 'patient') {
            const patient = await Patient.findByUserId(userId);
            if (!patient || appointment.patient_id !== patient.id) {
                return res.status(403).json({
                    message: 'ይህን መረጃ ለማየት ፈቃድ የለዎትም - Unauthorized access'
                });
            }
            return res.json(appointment);
        }

        if (role === 'therapist') {
            const therapist = await Therapist.findByUserId(userId);
            if (!therapist || appointment.therapist_id !== therapist.id) {
                return res.status(403).json({
                    message: 'ይህን መረጃ ለማየት ፈቃድ የለዎትም - Unauthorized access'
                });
            }
            return res.json(appointment);
        }

        return res.status(403).json({
            message: 'ይህን መረጃ ለማየት ፈቃድ የለዎትም - Unauthorized access'
        });
    } catch (error) {
        logger.error('Get appointment by ID error:', error);
        res.status(500).json({
            message: 'መረጃ ማምጣት አልተሳካም - Failed to get appointment'
        });
    }
};

const getAppointments = async (req, res) => {
    try {
        const role = req.user.role;

        if (role === 'patient') {
            const appointments = await Patient.getAppointments(req.user.id);
            return res.json(appointments);
        }

        if (role === 'therapist') {
            const therapist = await Therapist.findByUserId(req.user.id);
            if (!therapist) {
                return res.status(404).json({
                    message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
                });
            }

            const appointments = await Therapist.getAppointments(therapist.id);
            return res.json(appointments);
        }

        if (role === 'admin' || role === 'receptionist') {
            const result = await query(`
                SELECT 
                    a.*,
                    pu.full_name AS patient_name,
                    pu.email AS patient_email,
                    tu.full_name AS therapist_name,
                    t.specialization AS therapist_specialization
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users pu ON p.user_id = pu.id
                JOIN therapists t ON a.therapist_id = t.id
                JOIN users tu ON t.user_id = tu.id
                ORDER BY a.appointment_date DESC, a.start_time DESC
            `);
            return res.json(result.rows);
        }

        return res.status(403).json({
            message: 'ይህን ክወና ለማድረግ ፈቃድ የለዎትም - Insufficient permissions'
        });
    } catch (error) {
        logger.error('List appointments error:', error);
        res.status(500).json({
            message: 'ቀጠሮዎች ማምጣት አልተሳካም - Failed to list appointments'
        });
    }
};

const createAppointment = async (req, res) => {
    try {
        validateAppointmentPayload(req.body);

        const role = req.user.role;
        let patientId = req.body.patient_id;

        if (role === 'patient') {
            const patient = await Patient.findByUserId(req.user.id);
            if (!patient) {
                return res.status(404).json({
                    message: 'የታካሚ መገለጫ አልተገኘም - Patient profile not found'
                });
            }
            patientId = patient.id;
        }

        if (!patientId) {
            return res.status(400).json({
                message: 'ታካሚ አልተመረጠም - Patient is required'
            });
        }

        const appointment = await Appointment.create({
            patient_id: patientId,
            therapist_id: req.body.therapist_id,
            appointment_date: req.body.appointment_date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            type: req.body.type || 'follow-up',
            notes: req.body.notes || '',
            status: req.body.status || 'scheduled'
        });

        res.status(201).json({
            message: 'ቀጠሮ በተሳካ ሁኔታ ተይዟል - Appointment booked successfully',
            appointment
        });
    } catch (error) {
        logger.error('Create appointment error:', error);
        const status = error.status || 500;
        res.status(status).json({
            message: error.message || 'ቀጠሮ መያዝ አልተሳካም - Failed to book appointment'
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!status) {
            return res.status(400).json({
                message: 'ሁኔታ አስፈላጊ ነው - Status is required'
            });
        }

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                message: 'ቀጠሮ አልተገኘም - Appointment not found'
            });
        }

        if (req.user.role === 'therapist') {
            const therapist = await Therapist.findByUserId(req.user.id);
            if (!therapist || appointment.therapist_id !== therapist.id) {
                return res.status(403).json({
                    message: 'ይህን ቀጠሮ ማስተካከል አይችሉም - Not authorized for this appointment'
                });
            }
        } else if (req.user.role !== 'admin' && req.user.role !== 'receptionist') {
            return res.status(403).json({
                message: 'ይህን ቀጠሮ ማስተካከል አይችሉም - Not authorized for this appointment'
            });
        }

        const updated = await Appointment.updateStatus(id, status, notes);
        res.json({
            message: 'የቀጠሮ ሁኔታ በተሳካ ሁኔታ ተቀይሯል - Appointment status updated',
            appointment: updated
        });
    } catch (error) {
        logger.error('Update appointment status error:', error);
        res.status(500).json({
            message: 'ሁኔታ ማዘመን አልተሳካም - Failed to update status'
        });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                message: 'ቀጠሮ አልተገኘም - Appointment not found'
            });
        }

        if (req.user.role === 'patient') {
            const patient = await Patient.findByUserId(req.user.id);
            if (!patient || appointment.patient_id !== patient.id) {
                return res.status(403).json({
                    message: 'ይህን ቀጠሮ መሰረዝ አይችሉም - Not authorized to cancel this appointment'
                });
            }
        } else if (req.user.role === 'therapist') {
            const therapist = await Therapist.findByUserId(req.user.id);
            if (!therapist || appointment.therapist_id !== therapist.id) {
                return res.status(403).json({
                    message: 'ይህን ቀጠሮ መሰረዝ አይችሉም - Not authorized to cancel this appointment'
                });
            }
        } else if (req.user.role !== 'admin' && req.user.role !== 'receptionist') {
            return res.status(403).json({
                message: 'ይህን ቀጠሮ መሰረዝ አይችሉም - Not authorized to cancel this appointment'
            });
        }

        const cancelled = await Appointment.cancel(id, reason || 'Cancelled by user');
        res.json({
            message: 'ቀጠሮ በተሳካ ሁኔታ ተሰርዟል - Appointment cancelled successfully',
            appointment: cancelled
        });
    } catch (error) {
        logger.error('Cancel appointment error:', error);
        res.status(500).json({
            message: 'ቀጠሮ መሰረዝ አልተሳካም - Failed to cancel appointment'
        });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { therapist_id, date } = req.query;

        if (!therapist_id || !date) {
            return res.status(400).json({
                message: 'ሳይኮሎጂስት እና ቀን ያስፈልጋሉ - Therapist and date are required'
            });
        }

        const therapistResult = await query('SELECT id FROM therapists WHERE id = $1', [therapist_id]);
        if (therapistResult.rows.length === 0) {
            return res.status(404).json({
                message: 'ሳይኮሎጂስት አልተገኘም - Therapist not found'
            });
        }

        const schedule = await Therapist.getSchedule(Number(therapist_id));
        const requestedDay = new Date(date).getDay();
        const daySchedule = schedule.filter((slot) => Number(slot.day_of_week) === requestedDay);

        const bookedResult = await query(
            `SELECT start_time, end_time
             FROM appointments
             WHERE therapist_id = $1
             AND appointment_date = $2
             AND status NOT IN ('cancelled', 'completed')`,
            [therapist_id, date]
        );

        const availableSlots = [];
        daySchedule.forEach((slot) => {
            const generatedSlots = createTimeSlots(slot.start_time, slot.end_time, 60);
            generatedSlots.forEach((generatedSlot) => {
                const slotStart = generatedSlot.start;
                const slotEnd = generatedSlot.end;
                const isAvailable = isTimeSlotAvailable(slotStart, slotEnd, bookedResult.rows);
                if (isAvailable) {
                    availableSlots.push({
                        start_time: slotStart,
                        end_time: slotEnd
                    });
                }
            });
        });

        res.json({
            therapist_id: Number(therapist_id),
            date,
            available_slots: availableSlots
        });
    } catch (error) {
        logger.error('Get available slots error:', error);
        res.status(500).json({
            message: 'የተገኘው ጊዜ ማምጣት አልተሳካም - Failed to get available slots'
        });
    }
};

module.exports = {
    getById,
    getAppointments,
    createAppointment,
    updateStatus,
    cancelAppointment,
    getAvailableSlots
};
