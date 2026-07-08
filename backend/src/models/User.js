const { query } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        const {
            email,
            password,
            full_name,
            phone,
            role,
            ethiopian_id
        } = userData;

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await query(
            `INSERT INTO users (
                name,
                email,
                password_hash,
                role,
                student_id
             ) VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name as full_name, email, role, student_id as ethiopian_id, created_at`,
            [full_name, email, hashedPassword, role || 'patient', ethiopian_id || null]
        );

        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await query(
            `SELECT id, name as full_name, email, password_hash, role,
                    student_id as ethiopian_id, is_active, refresh_token, created_at
             FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await query(
            `SELECT id, name as full_name, email, role,
                    student_id as ethiopian_id, is_active, created_at
             FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async updateRefreshToken(userId, refreshToken) {
        await query(
            `UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [refreshToken, userId]
        );
    }

    static async findByRefreshToken(refreshToken) {
        const result = await query(
            `SELECT id, name as full_name, email, password_hash, role, 
                    student_id as ethiopian_id, is_active 
             FROM users WHERE refresh_token = $1`,
            [refreshToken]
        );
        return result.rows[0];
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await query(
            `UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [hashedPassword, userId]
        );
    }

    static async deactivate(userId) {
        await query(
            `UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [userId]
        );
    }

    static async activate(userId) {
        await query(
            `UPDATE users SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [userId]
        );
    }

    static async updateRole(userId, role) {
        await query(
            `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [role, userId]
        );
    }

    static async getAll(filters = {}) {
        let queryText = `
            SELECT id, name as full_name, email, role, 
                   student_id as ethiopian_id, is_active, created_at 
            FROM users
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.role) {
            queryText += ` AND role = $${paramIndex}`;
            params.push(filters.role);
            paramIndex++;
        }

        if (filters.is_active !== undefined) {
            queryText += ` AND is_active = $${paramIndex}`;
            params.push(filters.is_active);
            paramIndex++;
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, params);
        return result.rows;
    }

    static async comparePassword(password, hashedPassword) {
        if (!password || !hashedPassword) {
            return false;
        }

        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            return false;
        }
    }

    static async update(userId, updates) {
        const allowedFields = ['name', 'phone'];
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
            `UPDATE users 
             SET ${setClause.join(', ')}
             WHERE id = $${params.length}
             RETURNING id, name as full_name, email, role, student_id as ethiopian_id`,
            params
        );

        return result.rows[0];
    }
}

module.exports = User;