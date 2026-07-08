const { query } = require('../config/database');

class StaffSchedule {
    static async create(scheduleData) {
        const { therapist_id, day_of_week, start_time, end_time, is_active = true } = scheduleData;
        const result = await query(
            `INSERT INTO staff_schedules (therapist_id, day_of_week, start_time, end_time, is_active)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [therapist_id, day_of_week, start_time, end_time, is_active]
        );
        return result.rows[0];
    }

    static async findByTherapistId(therapistId) {
        const result = await query(
            `SELECT * FROM staff_schedules 
             WHERE therapist_id = $1 AND is_active = true
             ORDER BY day_of_week, start_time`,
            [therapistId]
        );
        return result.rows;
    }

    static async deactivateAll(therapistId) {
        await query(
            `UPDATE staff_schedules SET is_active = false, updated_at = CURRENT_TIMESTAMP
             WHERE therapist_id = $1`,
            [therapistId]
        );
    }
}

module.exports = StaffSchedule;
