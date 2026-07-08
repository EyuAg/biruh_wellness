const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/available-slots', appointmentController.getAvailableSlots);
router.get('/my', appointmentController.getAppointments);
router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.patch('/:id/status', appointmentController.updateStatus);
router.delete('/:id', appointmentController.cancelAppointment);
router.get('/:id', appointmentController.getById);

module.exports = router;
