const { query } = require('../config/database');

class CrisisIncident {
    static async create(incidentData) {
        const {
            patient_id,
            therapist_id,
            type,
            description = '',
            severity,
            intervention = '',
            outcome = '',
            is_resolved = false
        } = incidentData;

        const result = await query(
            `INSERT INTO crisis_incidents (
                patient_id, therapist_id, type, description,
                severity, intervention, outcome, is_resolved
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [patient_id, therapist_id, type, description, severity, intervention, outcome, is_resolved]
        );
        return result.rows[0];
    }

    static async findByPatientId(patientId) {
        const result = await query(
            `SELECT ci.*, u.full_name as therapist_name
             FROM crisis_incidents ci
             JOIN therapists t ON ci.therapist_id = t.id
             JOIN users u ON t.user_id = u.id
             WHERE ci.patient_id = $1
             ORDER BY ci.incident_date DESC`,
            [patientId]
        );
        return result.rows;
    }

    static async findByTherapistId(therapistId) {
        const result = await query(
            `SELECT ci.*, u.full_name as patient_name
             FROM crisis_incidents ci
             JOIN patients p ON ci.patient_id = p.id
             JOIN users u ON p.user_id = u.id
             WHERE ci.therapist_id = $1
             ORDER BY ci.incident_date DESC`,
            [therapistId]
        );
        return result.rows;
    }

    static async updateResolution(id, isResolved, outcome = '') {
        const result = await query(
            `UPDATE crisis_incidents
             SET is_resolved = $1, outcome = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [isResolved, outcome, id]
        );
        return result.rows[0];
    }
}

module.exports = CrisisIncident;
