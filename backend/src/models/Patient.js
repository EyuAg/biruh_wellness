const { query } = require('../config/database');

class Patient {
    static async create(patientData) {
        const {
            user_id,
            date_of_birth,
            gender,
            region,
            city,
            emergency_contact_name,
            emergency_contact_phone,
            insurance_provider,
            insurance_id,
            allergies,
            chronic_conditions,
            preferred_language = 'amharic',
            marital_status
        } = patientData;

        const result = await query(
            `INSERT INTO patients (
                user_id, date_of_birth, gender, region, city,
                emergency_contact_name, emergency_contact_phone,
                insurance_provider, insurance_id, allergies,
                chronic_conditions, preferred_language, marital_status
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING *`,
            [
                user_id, date_of_birth, gender, region, city,
                emergency_contact_name, emergency_contact_phone,
                insurance_provider, insurance_id, allergies,
                chronic_conditions, preferred_language, marital_status
            ]
        );

        return result.rows[0];
    }

    static async findByUserId(userId) {
        const result = await query(
            `SELECT p.*, u.name as full_name, u.email, u.student_id as ethiopian_id
             FROM patients p
             JOIN users u ON p.user_id = u.id
             WHERE p.user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }

    static async update(userId, updates) {
        const allowedFields = [
            'date_of_birth', 'gender', 'region', 'city',
            'emergency_contact_name', 'emergency_contact_phone',
            'insurance_provider', 'insurance_id', 'allergies',
            'chronic_conditions', 'preferred_language', 'marital_status'
        ];

        const setClause = [];
        const params = [];
        let paramIndex = 1;

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                setClause.push(`${field} = $${paramIndex}`);
                params.push(updates[field]);
                paramIndex++;
            }
        }

        if (setClause.length === 0) return null;

        setClause.push(`updated_at = CURRENT_TIMESTAMP`);
        params.push(userId);

        const result = await query(
            `UPDATE patients 
             SET ${setClause.join(', ')}
             WHERE user_id = $${params.length}
             RETURNING *`,
            params
        );

        return result.rows[0];
    }

    static async getAppointments(userId) {
        const result = await query(
            `SELECT 
                a.*,
                u.name as therapist_name,
                u.email as therapist_email,
                t.specialization as therapist_specialization
             FROM appointments a
             JOIN therapists t ON a.therapist_id = t.id
             JOIN users u ON t.user_id = u.id
             WHERE a.patient_id = (
                 SELECT id FROM patients WHERE user_id = $1
             )
             ORDER BY a.appointment_date DESC, a.start_time DESC`,
            [userId]
        );
        return result.rows;
    }

    static async getSessionNotes(userId) {
        const result = await query(
            `SELECT 
                sn.*,
                a.appointment_date,
                u.name as therapist_name,
                t.specialization as therapist_specialization
             FROM session_notes sn
             JOIN appointments a ON sn.appointment_id = a.id
             JOIN therapists t ON a.therapist_id = t.id
             JOIN users u ON t.user_id = u.id
             WHERE a.patient_id = (
                 SELECT id FROM patients WHERE user_id = $1
             )
             ORDER BY a.appointment_date DESC`,
            [userId]
        );
        return result.rows;
    }
}

module.exports = Patient;