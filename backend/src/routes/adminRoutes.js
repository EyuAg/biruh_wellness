const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authorize } = require('../middleware/auth');
const { validate, adminSchemas } = require('../middleware/validation');

// All admin endpoints require admin role authorization
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard', adminController.getDashboard);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', validate(adminSchemas.updateUserRole), adminController.updateUserRole);
router.put('/users/:id/status', validate(adminSchemas.updateUserStatus), adminController.updateUserStatus);

// Audit logs
router.get('/audit', adminController.getAuditLogs);

// Clinic reports
router.get('/reports/appointments', (req, res, next) => {
    req.query.type = 'appointments';
    next();
}, adminController.getReports);

router.get('/reports/revenue', (req, res, next) => {
    req.query.type = 'revenue';
    next();
}, adminController.getReports);

router.get('/reports', adminController.getReports);

module.exports = router;
