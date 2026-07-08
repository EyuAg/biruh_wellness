const isEmpty = (value) => value === null || value === undefined || value === '';

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const formatDate = (date) => new Date(date).toISOString().split('T')[0];

module.exports = {
    isEmpty,
    normalizeEmail,
    formatDate
};
