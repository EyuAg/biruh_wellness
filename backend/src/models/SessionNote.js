const { query } = require('../config/database');
const { encrypt, decrypt } = require('../services/encryptionService');

class SessionNote {
    static async create(noteData) {
        const {
            appointment_id,
            therapist_id,
            subjective,
            objective,
            assessment,
            plan,
            mood_rating,
            anxiety_rating,
            sleep_quality,
            appetite_status,
            suicidal_ideation = false,
            self_harm = false,
            medication_adherence = '',
            homework = '',
            next_session_goals = '',
            is_encrypted = true
        } = noteData;

        // Encrypt sensitive fields (serialized as JSON strings for database storage)
        const encryptedSubjective = JSON.stringify(encrypt(subjective));
        const encryptedObjective = JSON.stringify(encrypt(objective));
        const encryptedAssessment = JSON.stringify(encrypt(assessment));
        const encryptedPlan = JSON.stringify(encrypt(plan));

        const result = await query(
            `INSERT INTO session_notes (
                appointment_id, therapist_id,
                subjective, objective, assessment, plan,
                mood_rating, anxiety_rating, sleep_quality, appetite_status,
                suicidal_ideation, self_harm, medication_adherence,
                homework, next_session_goals, is_encrypted
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
             RETURNING *`,
            [
                appointment_id, therapist_id,
                encryptedSubjective, encryptedObjective, encryptedAssessment, encryptedPlan,
                mood_rating, anxiety_rating, sleep_quality, appetite_status,
                suicidal_ideation, self_harm, medication_adherence,
                homework, next_session_goals, is_encrypted
            ]
        );

        return result.rows[0];
    }

    static async findById(id, decryptContent = false) {
        const result = await query(
            `SELECT 
                sn.*,
                a.appointment_date,
                a.start_time,
                a.end_time,
                pu.name as patient_name,
                pu.email as patient_email,
                tu.name as therapist_name
             FROM session_notes sn
             JOIN appointments a ON sn.appointment_id = a.id
             JOIN patients p ON a.patient_id = p.id
             JOIN users pu ON p.user_id = pu.id
             JOIN therapists t ON a.therapist_id = t.id
             JOIN users tu ON t.user_id = tu.id
             WHERE sn.id = $1`,
            [id]
        );

        if (result.rows.length === 0) return null;

        const note = result.rows[0];
        
        if (decryptContent && note.is_encrypted) {
            try {
                note.subjective = decrypt(JSON.parse(note.subjective));
                note.objective = decrypt(JSON.parse(note.objective));
                note.assessment = decrypt(JSON.parse(note.assessment));
                note.plan = decrypt(JSON.parse(note.plan));
            } catch (err) {
                // Return fallback/raw text if parsing fails
            }
        }

        return note;
    }

    static async findByAppointment(appointmentId, decryptContent = false) {
        const result = await query(
            `SELECT * FROM session_notes 
             WHERE appointment_id = $1
             ORDER BY created_at DESC`,
            [appointmentId]
        );

        if (decryptContent && result.rows.length > 0) {
            return result.rows.map(note => {
                if (note.is_encrypted) {
                    try {
                        note.subjective = decrypt(JSON.parse(note.subjective));
                        note.objective = decrypt(JSON.parse(note.objective));
                        note.assessment = decrypt(JSON.parse(note.assessment));
                        note.plan = decrypt(JSON.parse(note.plan));
                    } catch (err) {
                        // ignore or fallback
                    }
                }
                return note;
            });
        }

        return result.rows;
    }

    static async update(id, updates) {
        const allowedFields = [
            'subjective', 'objective', 'assessment', 'plan',
            'mood_rating', 'anxiety_rating', 'sleep_quality', 'appetite_status',
            'suicidal_ideation', 'self_harm', 'medication_adherence',
            'homework', 'next_session_goals'
        ];

        const setClause = [];
        const params = [];
        let paramIndex = 1;

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                // Encrypt sensitive fields
                let value = updates[field];
                if (['subjective', 'objective', 'assessment', 'plan'].includes(field)) {
                    const encrypted = encrypt(value);
                    value = JSON.stringify(encrypted);
                }
                setClause.push(`${field} = $${paramIndex}`);
                params.push(value);
                paramIndex++;
            }
        }

        if (setClause.length === 0) return null;

        setClause.push(`updated_at = CURRENT_TIMESTAMP`);
        params.push(id);

        const result = await query(
            `UPDATE session_notes 
             SET ${setClause.join(', ')}
             WHERE id = $${params.length}
             RETURNING *`,
            params
        );

        return result.rows[0];
    }

    static async getPatientNotes(patientId, decryptContent = false) {
        const result = await query(
            `SELECT 
                sn.*,
                a.appointment_date,
                tu.full_name as therapist_name
             FROM session_notes sn
             JOIN appointments a ON sn.appointment_id = a.id
             JOIN therapists t ON a.therapist_id = t.id
             JOIN users tu ON t.user_id = tu.id
             WHERE a.patient_id = $1
             ORDER BY a.appointment_date DESC`,
            [patientId]
        );

        if (decryptContent && result.rows.length > 0) {
            return result.rows.map(note => {
                if (note.is_encrypted) {
                    try {
                        note.subjective = decrypt(JSON.parse(note.subjective));
                        note.objective = decrypt(JSON.parse(note.objective));
                        note.assessment = decrypt(JSON.parse(note.assessment));
                        note.plan = decrypt(JSON.parse(note.plan));
                    } catch (err) {
                        // ignore or fallback
                    }
                }
                return note;
            });
        }

        return result.rows;
    }

    static async findByTherapistId(therapistId, decryptContent = false) {
        const result = await query(
            `SELECT
                sn.id,
                sn.appointment_id,
                sn.subjective,
                sn.assessment,
                sn.plan,
                sn.is_encrypted,
                sn.created_at,
                a.appointment_date,
                a.start_time,
                u.name as patient_name
             FROM session_notes sn
             JOIN appointments a ON sn.appointment_id = a.id
             JOIN patients p ON a.patient_id = p.id
             JOIN users u ON p.user_id = u.id
             WHERE sn.therapist_id = $1
             ORDER BY a.appointment_date DESC`,
            [therapistId]
        );

        const notes = result.rows.map((note) => ({
            id: note.id,
            appointment_id: note.appointment_id,
            patient_name: note.patient_name,
            date: note.appointment_date,
            time: note.start_time,
            excerpt: note.is_encrypted ? 'Encrypted session note' : (note.subjective ? note.subjective.slice(0, 120) : ''),
            created_at: note.created_at
        }));

        return notes;
    }

    static async getRiskAssessments(therapistId) {
        const result = await query(
            `SELECT 
                sn.*,
                a.appointment_date,
                pu.full_name as patient_name
             FROM session_notes sn
             JOIN appointments a ON sn.appointment_id = a.id
             JOIN patients p ON a.patient_id = p.id
             JOIN users pu ON p.user_id = pu.id
             WHERE sn.therapist_id = $1
             AND (sn.suicidal_ideation = true OR sn.self_harm = true)
             ORDER BY a.appointment_date DESC`,
            [therapistId]
        );
        return result.rows;
    }
}

module.exports = SessionNote;