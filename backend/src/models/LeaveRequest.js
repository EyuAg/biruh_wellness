const { query } = require('../config/database');

class LeaveRequest {
    static async create(leaveData) {
        const { therapist_id, start_date, end_date, reason } = leaveData;
        const result = await query(
            `INSERT INTO leave_requests (therapist_id, start_date, end_date, reason, status)
             VALUES ($1, $2, $3, $4, 'pending')
             RETURNING *`,
            [therapist_id, start_date, end_date, reason]
        );
        return result.rows[0];
    }

    static async findByTherapistId(therapistId) {
        const result = await query(
            `SELECT * FROM leave_requests 
             WHERE therapist_id = $1
             ORDER BY start_date DESC`,
            [therapistId]
        );
        return result.rows;
    }

    static async getAll() {
        const result = await query(
            `SELECT lr.*, u.name as therapist_name, u.email as therapist_email
             FROM leave_requests lr
             JOIN therapists t ON lr.therapist_id = t.id
             JOIN users u ON t.user_id = u.id
             ORDER BY lr.created_at DESC`
        );
        return result.rows;
    }

    static async updateStatus(id, status, approvedBy) {
        const result = await query(
            `UPDATE leave_requests 
             SET status = $1, approved_by = $2, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [status, approvedBy, id]
        );
        return result.rows[0];
    }
}

module.exports = LeaveRequest;
