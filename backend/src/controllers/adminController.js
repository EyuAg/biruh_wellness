const User = require('../models/User');
const Appointment = require('../models/Appointment');
const AuditLog = require('../models/AuditLog');
const { logger } = require('../utils/logger');

const getDashboard = async (req, res) => {
    try {
        const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = req.query.endDate || new Date();

        const stats = await Appointment.getClinicStats(startDate, endDate);
        const revenue = await Appointment.getRevenue(startDate, endDate);
        const users = await User.getAll();
        const activeUsers = users.filter(u => u.is_active).length;

        res.json({
            period: { startDate, endDate },
            appointments: stats,
            revenue: revenue || { total_revenue: 0, avg_fee: 0 },
            users: {
                total: users.length,
                active: activeUsers,
                by_role: {
                    patient: users.filter(u => u.role === 'patient').length,
                    therapist: users.filter(u => u.role === 'therapist').length,
                    receptionist: users.filter(u => u.role === 'receptionist').length,
                    admin: users.filter(u => u.role === 'admin').length
                }
            }
        });
    } catch (error) {
        logger.error('Get admin dashboard error:', error);
        res.status(500).json({
            message: 'ዳሽቦርድ ማምጣት አልተሳካም - Failed to get dashboard'
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const { role, is_active } = req.query;
        const filters = {};
        if (role) filters.role = role;
        if (is_active !== undefined) filters.is_active = is_active === 'true';

        const users = await User.getAll(filters);
        res.json(users);
    } catch (error) {
        logger.error('Get users error:', error);
        res.status(500).json({
            message: 'ተጠቃሚዎች ማምጣት አልተሳካም - Failed to get users'
        });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'ተጠቃሚ አልተገኘም - User not found'
            });
        }

        await User.updateRole(id, role);

        // Audit log
        await AuditLog.create({
            user_id: req.user.id,
            action: 'UPDATE_ROLE',
            table_name: 'users',
            record_id: id,
            old_data: JSON.stringify({ role: user.role }),
            new_data: JSON.stringify({ role })
        });

        res.json({
            message: 'የተጠቃሚ ሚና በተሳካ ሁኔታ ተቀይሯል - User role updated successfully'
        });
    } catch (error) {
        logger.error('Update user role error:', error);
        res.status(500).json({
            message: 'ሚና ማዘመን አልተሳካም - Failed to update role'
        });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'ተጠቃሚ አልተገኘም - User not found'
            });
        }

        if (is_active) {
            await User.updateRefreshToken(id, null); // Reactivate
        } else {
            await User.deactivate(id);
        }

        // Audit log
        await AuditLog.create({
            user_id: req.user.id,
            action: is_active ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
            table_name: 'users',
            record_id: id,
            old_data: JSON.stringify({ is_active: user.is_active }),
            new_data: JSON.stringify({ is_active })
        });

        res.json({
            message: is_active ? 
                'ተጠቃሚ በተሳካ ሁኔታ ነቅቷል - User activated successfully' :
                'ተጠቃሚ በተሳካ ሁኔታ ተሰርዟል - User deactivated successfully'
        });
    } catch (error) {
        logger.error('Update user status error:', error);
        res.status(500).json({
            message: 'ሁኔታ ማዘመን አልተሳካም - Failed to update status'
        });
    }
};

const getAuditLogs = async (req, res) => {
    try {
        const { user_id, action, table_name, startDate, endDate, limit, offset } = req.query;
        
        const logs = await AuditLog.getLogs({
            user_id,
            action,
            table_name,
            startDate,
            endDate,
            limit: limit || 100,
            offset: offset || 0
        });

        res.json(logs);
    } catch (error) {
        logger.error('Get audit logs error:', error);
        res.status(500).json({
            message: 'የኦዲት መዝገቦች ማምጣት አልተሳካም - Failed to get audit logs'
        });
    }
};

const getReports = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        const sDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const eDate = endDate || new Date();

        let report = {};
        
        switch (type) {
            case 'appointments':
                report = await Appointment.getClinicStats(sDate, eDate);
                break;
            case 'revenue':
                report = await Appointment.getRevenue(sDate, eDate);
                break;
            default:
                // Combined report
                const stats = await Appointment.getClinicStats(sDate, eDate);
                const revenue = await Appointment.getRevenue(sDate, eDate);
                const users = await User.getAll();
                
                report = {
                    period: { startDate: sDate, endDate: eDate },
                    appointments: stats,
                    revenue: revenue || { total_revenue: 0, avg_fee: 0 },
                    users: {
                        total: users.length,
                        active: users.filter(u => u.is_active).length
                    },
                    system_activity: await AuditLog.getSystemActivity({ startDate: sDate, endDate: eDate })
                };
        }

        res.json(report);
    } catch (error) {
        logger.error('Get reports error:', error);
        res.status(500).json({
            message: 'ሪፖርቶች ማምጣት አልተሳካም - Failed to get reports'
        });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    updateUserRole,
    updateUserStatus,
    getAuditLogs,
    getReports
};