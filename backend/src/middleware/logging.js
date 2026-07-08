const { logger } = require('../utils/logger');
const AuditLog = require('../models/AuditLog');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log request
    logger.info('Request received', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        user: req.user ? req.user.id : 'anonymous'
    });

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            user: req.user ? req.user.id : 'anonymous'
        };

        if (res.statusCode >= 400) {
            logger.error('Request failed', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });

    next();
};

const auditLogger = (action, tableName) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        
        res.send = function(data) {
            try {
                // Extract record ID from response if available
                let recordId = null;
                if (data) {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.id) {
                        recordId = parsed.id;
                    }
                }

                // Create audit log entry
                const logEntry = {
                    user_id: req.user ? req.user.id : null,
                    action: action,
                    table_name: tableName,
                    record_id: recordId,
                    ip_address: req.ip,
                    user_agent: req.get('user-agent')
                };

                // For sensitive operations, log the data
                if (['CREATE', 'UPDATE', 'DELETE'].includes(action.toUpperCase())) {
                    logEntry.new_data = JSON.stringify(req.body);
                }

                AuditLog.create(logEntry).catch(err => {
                    logger.error('Failed to create audit log:', err);
                });
            } catch (error) {
                logger.error('Audit logging error:', error);
            }

            originalSend.call(this, data);
        };

        next();
    };
};

module.exports = {
    requestLogger,
    auditLogger
};