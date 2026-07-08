/**
 * Role-based email validation rules.
 * Therapist emails should come from recognized professional domains
 * Admin emails can be restricted to an internal domain (optional).
 * Patients are allowed any email.
 */

const DEFAULT_THERAPIST_DOMAINS = ['biruhwellness.com'];
const DEFAULT_ADMIN_DOMAINS = ['biruhwellness.org'];
const BLOCKED_PATIENT_DOMAINS = ['biruhwellness.com', 'biruhwellness.org'];

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

  const domain = getDomainFromEmail(email);
  if (!domain) return false;

  // patients can use any email except the restricted Biruh Wellness domains
  if (role === 'patient') {
    return !BLOCKED_PATIENT_DOMAINS.some((blockedDomain) => domain === blockedDomain || domain.endsWith(`.${blockedDomain}`));
  }

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
