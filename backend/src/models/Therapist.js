const { query } = require('../config/database');

class Therapist {
    static async create(therapistData) {
        const {
            user_id,
            license_number,
            specialization,
            consultation_fee,
            years_experience,
            education,
            bio,
            availability_description
        } = therapistData;

        const result = await query(
            `INSERT INTO therapists (
                user_id, license_number, specialization, consultation_fee,
                years_experience, education, bio, availability_description
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                user_id, license_number, specialization, consultation_fee,
                years_experience, education, bio, availability_description
            ]
        );

        return result.rows[0];
    }

    static async findByUserId(userId) {
        const result = await query(
            `SELECT t.*, u.email, u.name as full_name, u.student_id as ethiopian_id
             FROM therapists t
             JOIN users u ON t.user_id = u.id
             WHERE t.user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }

    static async getWithAvailability(userId) {
        const result = await query(
            `SELECT t.*, u.email, u.name as full_name, u.student_id as ethiopian_id,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'day_of_week', s.day_of_week,
                                'start_time', s.start_time,
                                'end_time', s.end_time
                            )
                        ) FILTER (WHERE s.id IS NOT NULL),
                        '[]'
                    ) as schedule
             FROM therapists t
             JOIN users u ON t.user_id = u.id
             LEFT JOIN staff_schedules s ON t.id = s.therapist_id AND s.is_active = true
             WHERE t.user_id = $1
             GROUP BY t.id, u.id`,
            [userId]
        );
        return result.rows[0];
    }

    static async getAppointments(therapistId) {
        const result = await query(
            `SELECT 
                a.*,
                u.name as patient_name,
                u.email as patient_email,
                p.emergency_contact_name,
                p.emergency_contact_phone
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN users u ON p.user_id = u.id
             WHERE a.therapist_id = $1
             AND a.status NOT IN ('cancelled', 'completed')
             ORDER BY a.appointment_date ASC, a.start_time ASC`,
            [therapistId]
        );
        return result.rows;
    }

    static async getSchedule(therapistId) {
        const result = await query(
            `SELECT * FROM staff_schedules
             WHERE therapist_id = $1 AND is_active = true
             ORDER BY day_of_week, start_time`,
            [therapistId]
        );
        return result.rows;
    }

    static async updateSchedule(therapistId, scheduleData) {
        // Deactivate existing schedule
        await query(
            'UPDATE staff_schedules SET is_active = false WHERE therapist_id = $1',
            [therapistId]
        );

        // Insert new schedule
        for (const day of scheduleData) {
            await query(
                `INSERT INTO staff_schedules (
                    therapist_id, day_of_week, start_time, end_time, is_active
                 ) VALUES ($1, $2, $3, $4, true)`,
                [therapistId, day.day_of_week, day.start_time, day.end_time]
            );
        }

        return true;
    }

    static async getAvailableSlots(therapistId, date) {
        const result = await query(
            `SELECT 
                s.day_of_week,
                s.start_time,
                s.end_time,
                a.id as appointment_id,
                a.appointment_date,
                a.start_time as booked_start,
                a.end_time as booked_end
             FROM staff_schedules s
             LEFT JOIN appointments a ON 
                a.therapist_id = s.therapist_id 
                AND a.appointment_date = $2
                AND a.status NOT IN ('cancelled', 'completed')
             WHERE s.therapist_id = $1 
                AND s.is_active = true
                AND EXTRACT(DOW FROM $2::date) = s.day_of_week`,
            [therapistId, date]
        );
        return result.rows;
    }

    static async requestLeave(therapistId, leaveData) {
        const { start_date, end_date, reason } = leaveData;
        const result = await query(
            `INSERT INTO leave_requests (
                therapist_id, start_date, end_date, reason, status
             ) VALUES ($1, $2, $3, $4, 'pending')
             RETURNING *`,
            [therapistId, start_date, end_date, reason]
        );
        return result.rows[0];
    }

    static async getCaseload(therapistId) {
        const result = await query(
            `SELECT 
                COUNT(DISTINCT p.id) as total_patients,
                COUNT(a.id) as active_appointments,
                COUNT(sn.id) as total_notes
             FROM therapists t
             JOIN appointments a ON t.id = a.therapist_id
             JOIN patients p ON a.patient_id = p.id
             LEFT JOIN session_notes sn ON a.id = sn.appointment_id
             WHERE t.id = $1
             AND a.status NOT IN ('cancelled', 'completed')
             AND a.appointment_date >= CURRENT_DATE`,
            [therapistId]
        );
        return result.rows[0];
    }

    static async getAllTherapists() {
        try {
            const result = await query(
                `SELECT 
                    t.id, t.license_number, t.specialization, t.consultation_fee,
                    t.years_experience, t.bio,
                    u.id as user_id, u.name as full_name, u.email, u.student_id as ethiopian_id
                 FROM therapists t
                 JOIN users u ON t.user_id = u.id
                 WHERE u.is_active = true
                 ORDER BY u.name`
            );
            return result.rows;
        } catch (error) {
            return [];
        }
    }
}

module.exports = Therapist;