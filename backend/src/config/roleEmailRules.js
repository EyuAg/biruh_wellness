/**
 * Role-based email validation rules.
 * Therapist emails should come from recognized professional domains
 * Admin emails can be restricted to an internal domain (optional).
 * Patients are allowed any email.
 */

const DEFAULT_THERAPIST_DOMAINS = ['biruh.org'];
const DEFAULT_ADMIN_DOMAINS = ['admin.biruh'];

const rules = {
  therapist: {
    allowedDomains: process.env.THERAPIST_ALLOWED_DOMAINS
      ? process.env.THERAPIST_ALLOWED_DOMAINS.split(',').map(d => d.trim())
      : DEFAULT_THERAPIST_DOMAINS
  },
  admin: {
    allowedDomains: process.env.ADMIN_ALLOWED_DOMAINS
      ? process.env.ADMIN_ALLOWED_DOMAINS.split(',').map(d => d.trim())
      : DEFAULT_ADMIN_DOMAINS
  },
  patient: {
    // patients: any email allowed
    allowedDomains: null
  }
};

function getDomainFromEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const parts = email.toLowerCase().split('@');
  return parts.length > 1 ? parts[1] : '';
}

function validateEmailForRole(email, role) {
  if (!email || !role) return false;
  const r = rules[role];
  if (!r) return false;

  // patients allowed any email
  if (role === 'patient') return true;

  const domain = getDomainFromEmail(email);
  if (!domain) return false;

  // allowedDomains may include suffixes like '.edu'
  for (const d of r.allowedDomains) {
    if (!d) continue;
    if (d.startsWith('.')) {
      if (domain.endsWith(d)) return true;
    } else {
      if (domain === d) return true;
      // also allow subdomains: e.g., clinic.org, sub.clinic.org
      if (domain.endsWith(`.${d}`)) return true;
    }
  }

  return false;
}

module.exports = {
  rules,
  validateEmailForRole
};
