const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');
const SessionNote = require('../models/SessionNote');
const LeaveRequest = require('../models/LeaveRequest');
const Patient = require('../models/Patient');
const { logger } = require('../utils/logger');
const { auditLogger } = require('../middleware/logging');

const getProfile = async (req, res) => {
    try {
        const therapist = await Therapist.getWithAvailability(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }
        res.json(therapist);
    } catch (error) {
        logger.error('Get therapist profile error:', error);
        res.status(500).json({
            message: 'መረጃ ማምጣት አልተሳካም - Failed to get profile'
        });
    }
};

const getSchedule = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const schedule = await Therapist.getSchedule(therapist.id);
        res.json(schedule);
    } catch (error) {
        logger.error('Get therapist schedule error:', error);
        res.status(500).json({
            message: 'ፕሮግራም ማምጣት አልተሳካም - Failed to get schedule'
        });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        await Therapist.updateSchedule(therapist.id, req.body);

        // Audit log
        await auditLogger('UPDATE', 'staff_schedules')(req, res, () => {});

        res.json({
            message: 'ፕሮግራም በተሳካ ሁኔታ ተዘምኗል - Schedule updated successfully'
        });
    } catch (error) {
        logger.error('Update therapist schedule error:', error);
        res.status(500).json({
            message: 'ፕሮግራም ማዘመን አልተሳካም - Failed to update schedule'
        });
    }
};

const getAppointments = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const appointments = await Therapist.getAppointments(therapist.id);
        res.json(appointments);
    } catch (error) {
        logger.error('Get therapist appointments error:', error);
        res.status(500).json({
            message: 'ቀጠሮዎች ማምጣት አልተሳካም - Failed to get appointments'
        });
    }
};

const getSessionNotes = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const notes = await SessionNote.findByTherapistId(therapist.id);
        res.json(notes);
    } catch (error) {
        logger.error('Get therapist session notes error:', error);
        res.status(500).json({
            message: 'የክፍለ ጊዜ ማስታወሻዎች ማምጣት አልተሳካም - Failed to get session notes'
        });
    }
};

const getLeaveRequests = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const requests = await LeaveRequest.findByTherapistId(therapist.id);
        res.json(requests);
    } catch (error) {
        logger.error('Get therapist leave requests error:', error);
        res.status(500).json({
            message: 'የእረፍት ጊዜ ጥያቄዎች ማምጣት አልተሳካም - Failed to get leave requests'
        });
    }
};

const createSessionNote = async (req, res) => {
    try {
        const { appointment_id, ...noteData } = req.body;
        const therapist = await Therapist.findByUserId(req.user.id);
        
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        // Verify appointment belongs to therapist
        const appointment = await Appointment.findById(appointment_id);
        if (!appointment || appointment.therapist_id !== therapist.id) {
            return res.status(403).json({
                message: 'ይህን የቀጠሮ መረጃ ማስተካከል አይችሉም - Not authorized for this appointment'
            });
        }

        const note = await SessionNote.create({
            ...noteData,
            appointment_id,
            therapist_id: therapist.id
        });

        // Update appointment status
        await Appointment.updateStatus(appointment_id, 'in_progress');

        // Audit log
        await auditLogger('CREATE', 'session_notes')(req, res, () => {});

        res.status(201).json({
            message: 'የክፍለ ጊዜ ማስታወሻ በተሳካ ሁኔታ ተመዝግቧል - Session note created successfully',
            note
        });
    } catch (error) {
        logger.error('Create session note error:', error);
        res.status(500).json({
            message: 'ማስታወሻ መፍጠር አልተሳካም - Failed to create session note'
        });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const appointment = await Appointment.findById(id);
        if (!appointment || appointment.therapist_id !== therapist.id) {
            return res.status(403).json({
                message: 'ይህን ቀጠሮ ማስተካከል አይችሉም - Not authorized for this appointment'
            });
        }

        const updated = await Appointment.updateStatus(id, status, notes);

        // Audit log
        await auditLogger('UPDATE', 'appointments')(req, res, () => {});

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

const requestLeave = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const leaveRequest = await Therapist.requestLeave(therapist.id, req.body);

        // Audit log
        await auditLogger('CREATE', 'leave_requests')(req, res, () => {});

        res.status(201).json({
            message: 'የእረፍት ጊዜ ጥያቄ ተልኳል - Leave request submitted successfully',
            leaveRequest
        });
    } catch (error) {
        logger.error('Request leave error:', error);
        res.status(500).json({
            message: 'የእረፍት ጊዜ ጥያቄ መላክ አልተሳካም - Failed to submit leave request'
        });
    }
};

const getCaseload = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const caseload = await Therapist.getCaseload(therapist.id);
        res.json(caseload);
    } catch (error) {
        logger.error('Get caseload error:', error);
        res.status(500).json({
            message: 'የታካሚ ጭነት ማምጣት አልተሳካም - Failed to get caseload'
        });
    }
};

const getRiskAssessments = async (req, res) => {
    try {
        const therapist = await Therapist.findByUserId(req.user.id);
        if (!therapist) {
            return res.status(404).json({
                message: 'የሳይኮሎጂስት መገለጫ አልተገኘም - Therapist profile not found'
            });
        }

        const risks = await SessionNote.getRiskAssessments(therapist.id);
        res.json(risks);
    } catch (error) {
        logger.error('Get risk assessments error:', error);
        res.status(500).json({
            message: 'የአደጋ ምዘና ማምጣት አልተሳካም - Failed to get risk assessments'
        });
    }
};

module.exports = {
    getProfile,
    getSchedule,
    updateSchedule,
    getAppointments,
    getSessionNotes,
    createSessionNote,
    updateAppointmentStatus,
    requestLeave,
    getLeaveRequests,
    getCaseload,
    getRiskAssessments
};