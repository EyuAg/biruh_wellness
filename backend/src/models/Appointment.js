const { query } = require('../config/database');

class Appointment {
    static async create(appointmentData) {
        const {
            patient_id,
            therapist_id,
            appointment_date,
            start_time,
            end_time,
            type,
            notes = '',
            status = 'scheduled'
        } = appointmentData;

        // Check for double booking
        const conflictCheck = await query(
            `SELECT id FROM appointments 
             WHERE therapist_id = $1 
             AND appointment_date = $2
             AND status NOT IN ('cancelled', 'completed')
             AND (
                 (start_time <= $3 AND end_time > $3)
                 OR (start_time < $4 AND end_time >= $4)
                 OR (start_time >= $3 AND end_time <= $4)
             )`,
            [therapist_id, appointment_date, start_time, end_time]
        );

        if (conflictCheck.rows.length > 0) {
            throw new Error('ጊዜው ተይዟል - This time slot is already booked');
        }

        const result = await query(
            `INSERT INTO appointments (
                patient_id, therapist_id, appointment_date,
                start_time, end_time, type, notes, status
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                patient_id, therapist_id, appointment_date,
                start_time, end_time, type, notes, status
            ]
        );

        return result.rows[0];
    }

    static async findById(id) {
        const result = await query(
            `SELECT 
                a.*,
                pu.name as patient_name,
                pu.email as patient_email,
                tu.name as therapist_name,
                tu.email as therapist_email,
                t.specialization as therapist_specialization
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN users pu ON p.user_id = pu.id
             JOIN therapists t ON a.therapist_id = t.id
             JOIN users tu ON t.user_id = tu.id
             WHERE a.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async updateStatus(id, status, notes = null) {
        let queryText = `
            UPDATE appointments 
            SET status = $1, updated_at = CURRENT_TIMESTAMP
        `;
        const params = [status, id];

        if (notes) {
            queryText += `, notes = COALESCE(notes || E'\\n', '') || $3`;
            params.push(notes);
        }

        queryText += ` WHERE id = $2 RETURNING *`;
        
        const result = await query(queryText, params);
        return result.rows[0];
    }

    static async cancel(id, reason = '') {
        const result = await query(
            `UPDATE appointments 
             SET status = 'cancelled', 
                 cancellation_reason = $1,
                 cancelled_at = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [reason, id]
        );
        return result.rows[0];
    }

    static async getPatientAppointments(patientId, status = null) {
        let queryText = `
            SELECT 
                a.*,
                u.full_name as therapist_name,
                u.email as therapist_email,
                t.specialization as therapist_specialization
            FROM appointments a
            JOIN therapists t ON a.therapist_id = t.id
            JOIN users u ON t.user_id = u.id
            WHERE a.patient_id = $1
        `;
        const params = [patientId];

        if (status) {
            queryText += ` AND a.status = $2`;
            params.push(status);
        }

        queryText += ` ORDER BY a.appointment_date DESC, a.start_time DESC`;

        const result = await query(queryText, params);
        return result.rows;
    }

    static async getTherapistAppointments(therapistId, status = null) {
        let queryText = `
            SELECT 
                a.*,
                u.full_name as patient_name,
                u.email as patient_email,
                p.emergency_contact_name,
                p.emergency_contact_phone
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE a.therapist_id = $1
        `;
        const params = [therapistId];

        if (status) {
            queryText += ` AND a.status = $2`;
            params.push(status);
        }

        queryText += ` ORDER BY a.appointment_date ASC, a.start_time ASC`;

        const result = await query(queryText, params);
        return result.rows;
    }

    static async getUpcomingReminders() {
        const result = await query(
            `SELECT 
                a.*,
                pu.full_name as patient_name,
                pu.email as patient_email,
                pu.phone as patient_phone,
                tu.full_name as therapist_name
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN users pu ON p.user_id = pu.id
             JOIN therapists t ON a.therapist_id = t.id
             JOIN users tu ON t.user_id = tu.id
             WHERE a.appointment_date = CURRENT_DATE + INTERVAL '1 day'
             AND a.status = 'scheduled'
             AND a.reminder_sent = false`,
            []
        );
        return result.rows;
    }

    static async markReminderSent(id) {
        await query(
            'UPDATE appointments SET reminder_sent = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
            [id]
        );
    }

    static async getClinicStats(startDate, endDate) {
        const result = await query(
            `SELECT 
                COUNT(*) as total_appointments,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
                COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show,
                COUNT(DISTINCT patient_id) as unique_patients,
                COUNT(DISTINCT therapist_id) as active_therapists
             FROM appointments
             WHERE appointment_date BETWEEN $1 AND $2`,
            [startDate, endDate]
        );
        return result.rows[0];
    }

    static async getRevenue(startDate, endDate) {
        const result = await query(
            `SELECT 
                SUM(t.consultation_fee) as total_revenue,
                AVG(t.consultation_fee) as avg_fee
             FROM appointments a
             JOIN therapists t ON a.therapist_id = t.id
             WHERE a.status = 'completed'
             AND a.appointment_date BETWEEN $1 AND $2`,
            [startDate, endDate]
        );
        return result.rows[0];
    }
}

module.exports = Appointment;