const { query } = require('../config/database');

class IntakeForm {
    static async create(formData) {
        const {
            patient_id,
            presenting_problem = '',
            history_of_presenting_illness = '',
            psychiatric_history = '',
            medical_history = '',
            family_history = '',
            social_history = '',
            substance_use = '',
            suicide_risk = '',
            mental_status_exam = ''
        } = formData;

        const result = await query(
            `INSERT INTO intake_forms (
                patient_id, presenting_problem, history_of_presenting_illness,
                psychiatric_history, medical_history, family_history,
                social_history, substance_use, suicide_risk, mental_status_exam
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                patient_id, presenting_problem, history_of_presenting_illness,
                psychiatric_history, medical_history, family_history,
                social_history, substance_use, suicide_risk, mental_status_exam
            ]
        );
        return result.rows[0];
    }

    static async findByPatientId(patientId) {
        const result = await query(
            `SELECT * FROM intake_forms 
             WHERE patient_id = $1
             ORDER BY formulated_at DESC`,
            [patientId]
        );
        return result.rows[0];
    }
}

module.exports = IntakeForm;
