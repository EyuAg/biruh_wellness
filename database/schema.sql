-- ============================================
-- BIRUH WELLNESS CENTER - COMPLETE DATABASE SCHEMA
-- Mental Health Clinic Management System
-- ============================================


-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    student_id VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'therapist', 'receptionist', 'admin')),
    is_active BOOLEAN DEFAULT true,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================
-- 2. PATIENTS TABLE
-- ============================================
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    region VARCHAR(100),
    city VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    insurance_provider VARCHAR(100),
    insurance_id VARCHAR(50),
    allergies TEXT,
    chronic_conditions TEXT,
    preferred_language VARCHAR(20) DEFAULT 'english',
    marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_user_id ON patients(user_id);

-- ============================================
-- 3. THERAPISTS TABLE
-- ============================================
CREATE TABLE therapists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    years_experience INTEGER DEFAULT 0,
    education TEXT,
    bio TEXT,
    availability_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_therapists_user_id ON therapists(user_id);
CREATE INDEX idx_therapists_specialization ON therapists(specialization);

-- ============================================
-- 4. STAFF SCHEDULES TABLE
-- ============================================
CREATE TABLE staff_schedules (
    id SERIAL PRIMARY KEY,
    therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_schedules_therapist_id ON staff_schedules(therapist_id);
CREATE INDEX idx_staff_schedules_day ON staff_schedules(day_of_week);

-- ============================================
-- 5. APPOINTMENTS TABLE
-- ============================================
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type VARCHAR(20) DEFAULT 'follow-up' CHECK (type IN ('initial', 'follow-up', 'emergency')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_appointment_time UNIQUE (therapist_id, appointment_date, start_time, end_time)
);

CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================
-- 6. SESSION NOTES TABLE
-- ============================================
CREATE TABLE session_notes (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    subjective TEXT NOT NULL,
    objective TEXT NOT NULL,
    assessment TEXT NOT NULL,
    plan TEXT NOT NULL,
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
    anxiety_rating INTEGER CHECK (anxiety_rating BETWEEN 1 AND 10),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
    appetite_status VARCHAR(20) CHECK (appetite_status IN ('normal', 'decreased', 'increased')),
    suicidal_ideation BOOLEAN DEFAULT false,
    self_harm BOOLEAN DEFAULT false,
    medication_adherence TEXT,
    homework TEXT,
    next_session_goals TEXT,
    is_encrypted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_notes_appointment_id ON session_notes(appointment_id);
CREATE INDEX idx_session_notes_therapist_id ON session_notes(therapist_id);

-- ============================================
-- 7. TREATMENT PLANS TABLE
-- ============================================
CREATE TABLE treatment_plans (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    diagnosis TEXT,
    goals TEXT,
    milestones TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_treatment_plans_patient_id ON treatment_plans(patient_id);
CREATE INDEX idx_treatment_plans_therapist_id ON treatment_plans(therapist_id);
CREATE INDEX idx_treatment_plans_status ON treatment_plans(status);

-- ============================================
-- 8. INTAKE FORMS TABLE
-- ============================================
CREATE TABLE intake_forms (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    presenting_problem TEXT,
    history_of_presenting_illness TEXT,
    psychiatric_history TEXT,
    medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    substance_use TEXT,
    suicide_risk TEXT,
    mental_status_exam TEXT,
    formulated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_intake_forms_patient_id ON intake_forms(patient_id);

-- ============================================
-- 9. CRISIS INCIDENTS TABLE
-- ============================================
CREATE TABLE crisis_incidents (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    incident_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    intervention TEXT,
    outcome TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crisis_incidents_patient_id ON crisis_incidents(patient_id);
CREATE INDEX idx_crisis_incidents_therapist_id ON crisis_incidents(therapist_id);

-- ============================================
-- 10. LEAVE REQUESTS TABLE
-- ============================================
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leave_requests_therapist_id ON leave_requests(therapist_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- ============================================
-- 11. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================
-- 12. SYSTEM CONFIG TABLE
-- ============================================
CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapists_updated_at BEFORE UPDATE ON therapists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_notes_updated_at BEFORE UPDATE ON session_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_schedules_updated_at BEFORE UPDATE ON staff_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crisis_incidents_updated_at BEFORE UPDATE ON crisis_incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_intake_forms_updated_at BEFORE UPDATE ON intake_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL SYSTEM CONFIG
-- ============================================
INSERT INTO system_config (key, value, description) VALUES
('clinic_name', 'Biruh Wellness Center', 'Clinic display name'),
('clinic_phone', '+251-911-000000', 'Clinic contact phone'),
('clinic_email', 'info@biruhwellness.com', 'Clinic contact email'),
('clinic_address', 'Addis Ababa, Ethiopia', 'Clinic address'),
('default_consultation_fee', '800', 'Default consultation fee in ETB'),
('appointment_reminder_hours', '24', 'Hours before appointment for reminder'),
('cancellation_notice_hours', '48', 'Minimum hours for cancellation notice');

-- ============================================
-- CREATE DEFAULT ADMIN USER
-- Password: Admin@123
-- ============================================
INSERT INTO users (name, email, password_hash, role, is_active) VALUES (
    'System Administrator',
    'admin@biruhwellness.com',
    '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s',
    'admin',
    true
);
