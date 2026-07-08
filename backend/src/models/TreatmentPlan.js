const { query } = require('../config/database');

class TreatmentPlan {
    static async create(planData) {
        const {
            patient_id,
            therapist_id,
            diagnosis = '',
            goals = '',
            milestones = '',
            status = 'active'
        } = planData;

        const result = await query(
            `INSERT INTO treatment_plans (
                patient_id, therapist_id, diagnosis, goals, milestones, status
             ) VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [patient_id, therapist_id, diagnosis, goals, milestones, status]
        );
        return result.rows[0];
    }

    static async findByPatientId(patientId) {
        const result = await query(
            `SELECT tp.*, u.full_name as therapist_name
             FROM treatment_plans tp
             JOIN therapists t ON tp.therapist_id = t.id
             JOIN users u ON t.user_id = u.id
             WHERE tp.patient_id = $1
             ORDER BY tp.started_at DESC`,
            [patientId]
        );
        return result.rows;
    }

    static async updateStatus(id, status, completedAt = null) {
        let queryText = `
            UPDATE treatment_plans
            SET status = $1, updated_at = CURRENT_TIMESTAMP
        `;
        const params = [status, id];

        if (completedAt) {
            queryText += `, completed_at = $3`;
            params.push(completedAt);
        } else if (status === 'completed' || status === 'discontinued') {
            queryText += `, completed_at = CURRENT_TIMESTAMP`;
        }

        queryText += ` WHERE id = $2 RETURNING *`;

        const result = await query(queryText, params);
        return result.rows[0];
    }
}

module.exports = TreatmentPlan;
