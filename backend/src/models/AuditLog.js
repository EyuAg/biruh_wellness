const { query } = require('../config/database');

class AuditLog {
    static async create(logData) {
        const {
            user_id,
            action,
            table_name,
            record_id,
            old_data = null,
            new_data = null,
            ip_address = null,
            user_agent = null
        } = logData;

        const result = await query(
            `INSERT INTO audit_logs (
                user_id, action, table_name, record_id,
                old_data, new_data, ip_address, user_agent
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                user_id, action, table_name, record_id,
                old_data, new_data, ip_address, user_agent
            ]
        );

        return result.rows[0];
    }

    static async getLogs(filters = {}) {
        let queryText = `
            SELECT 
                al.*,
                u.full_name as user_name,
                u.email as user_email,
                u.role as user_role
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.user_id) {
            queryText += ` AND al.user_id = $${paramIndex}`;
            params.push(filters.user_id);
            paramIndex++;
        }

        if (filters.action) {
            queryText += ` AND al.action = $${paramIndex}`;
            params.push(filters.action);
            paramIndex++;
        }

        if (filters.table_name) {
            queryText += ` AND al.table_name = $${paramIndex}`;
            params.push(filters.table_name);
            paramIndex++;
        }

        if (filters.startDate) {
            queryText += ` AND al.created_at >= $${paramIndex}`;
            params.push(filters.startDate);
            paramIndex++;
        }

        if (filters.endDate) {
            queryText += ` AND al.created_at <= $${paramIndex}`;
            params.push(filters.endDate);
            paramIndex++;
        }

        const limit = filters.limit || 100;
        const offset = filters.offset || 0;

        queryText += ` ORDER BY al.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);
        return result.rows;
    }

    static async getUserActivity(userId, days = 30) {
        const result = await query(
            `SELECT 
                DATE(created_at) as date,
                COUNT(*) as action_count,
                json_agg(json_build_object(
                    'action', action,
                    'table_name', table_name,
                    'time', created_at
                )) as actions
             FROM audit_logs
             WHERE user_id = $1
             AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
             GROUP BY DATE(created_at)
             ORDER BY DATE(created_at) DESC`,
            [userId]
        );
        return result.rows;
    }

    static async getSystemActivity(filters = {}) {
        let queryText = `
            SELECT 
                action,
                table_name,
                COUNT(*) as count,
                MIN(created_at) as first_occurrence,
                MAX(created_at) as last_occurrence
            FROM audit_logs
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.startDate) {
            queryText += ` AND created_at >= $${paramIndex}`;
            params.push(filters.startDate);
            paramIndex++;
        }

        if (filters.endDate) {
            queryText += ` AND created_at <= $${paramIndex}`;
            params.push(filters.endDate);
            paramIndex++;
        }

        queryText += ` GROUP BY action, table_name ORDER BY count DESC`;

        const result = await query(queryText, params);
        return result.rows;
    }
}

module.exports = AuditLog;