const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authorize } = require('../middleware/auth');
const { validate, patientSchemas } = require('../middleware/validation');

// Patient profile endpoints
router.get(
    '/me',
    authorize('patient'),
    patientController.getProfile
);

router.put(
    '/me',
    authorize('patient'),
    validate(patientSchemas.updateProfile),
    patientController.updateProfile
);

// Appointment endpoints (accessible by patients themselves or receptionists)
router.get(
    '/appointments',
    authorize('patient', 'receptionist'),
    patientController.getAppointments
);

router.post(
    '/appointments',
    authorize('patient', 'receptionist'),
    validate(patientSchemas.bookAppointment),
    patientController.bookAppointment
);

router.delete(
    '/appointments/:id',
    authorize('patient', 'receptionist'),
    patientController.cancelAppointment
);

// Session history (encrypted SOAP notes) - only patient can view their own history (redacted)
router.get(
    '/consultations',
    authorize('patient'),
    patientController.getSessionHistory
);

// Get available therapists for scheduling
router.get(
    '/therapists',
    authorize('patient', 'receptionist'),
    patientController.getAvailableTherapists
);

module.exports = router;
