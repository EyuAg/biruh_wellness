const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');
const { authorize } = require('../middleware/auth');
const { validate, therapistSchemas } = require('../middleware/validation');

// All therapist routes require therapist role authorization
router.use(authorize('therapist'));

// Profile
router.get('/profile', therapistController.getProfile);

// Schedule configurations
router.get('/schedule', therapistController.getSchedule);
router.put('/schedule', validate(therapistSchemas.updateSchedule), therapistController.updateSchedule);

// Caseload appointments
router.get('/appointments', therapistController.getAppointments);

// Update appointment status (scheduled -> completed, no-show, etc.)
router.put('/appointments/:id/status', therapistController.updateAppointmentStatus);

// Create session SOAP note for an appointment
// Supports passing appointment ID in either parameters or body
router.post(
    '/appointments/:appointment_id/notes',
    (req, res, next) => {
        req.body.appointment_id = parseInt(req.params.appointment_id, 10);
        next();
    },
    validate(therapistSchemas.createSessionNote),
    therapistController.createSessionNote
);

// Leave requests
router.get('/leave-requests', therapistController.getLeaveRequests);
router.post('/leave-requests', validate(therapistSchemas.requestLeave), therapistController.requestLeave);
router.post('/leave', validate(therapistSchemas.requestLeave), therapistController.requestLeave);

// Session notes
router.get('/notes', therapistController.getSessionNotes);

// Analytics
router.get('/caseload', therapistController.getCaseload);
router.get('/risk-assessments', therapistController.getRiskAssessments);

module.exports = router;
