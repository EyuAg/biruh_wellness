-- ============================================
-- BIRUH WELLNESS CENTER - SEED DATA
-- Mental Health Clinic Management System
-- ============================================

-- ============================================
-- 1. ADMIN USERS
-- ============================================
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('John Smith', 'john.smith@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'admin', true),
('Sarah Johnson', 'sarah.johnson@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. THERAPISTS (10 Therapists)
-- ============================================

-- Therapist 1: Clinical Psychologist
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Dr. Alemayehu Tesfaye', 'alemayehu@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com'),
    'LIC-2024-001',
    'Clinical Psychology',
    1000,
    12,
    'Ph.D. in Clinical Psychology - Addis Ababa University',
    'Dr. Alemayehu is a Clinical Psychologist with over 12 years of experience in treating depression, anxiety disorders, and trauma. He specializes in Cognitive Behavioral Therapy (CBT) and is the founder of Biruh Wellness Center.'
);

-- Therapist 2: Child Psychologist
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Dr. Mahebereselam Aregay', 'mahebereselam@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com'),
    'LIC-2024-002',
    'Child Psychology',
    900,
    8,
    'Ph.D. in Child Psychology - Addis Ababa University',
    'Dr. Mahebereselam specializes in child and adolescent psychology. She has 8 years of experience working with children, teenagers, and families dealing with behavioral issues, academic stress, and developmental disorders.'
);

-- Therapist 3: Trauma Specialist
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Dr. Fikre Desalegn', 'fikre@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com'),
    'LIC-2024-003',
    'Trauma and Anxiety',
    1200,
    10,
    'M.D. in Psychiatry - Gondar University',
    'Dr. Fikre specializes in trauma, PTSD, and anxiety disorders. With 10 years of experience, he has worked with survivors of conflict, domestic violence, and other traumatic events.'
);

-- Therapist 4: Family Therapist
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('W/ro Hliti Gebreselassie', 'hliti@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'hliti@biruhwellness.com'),
    'LIC-2024-004',
    'Family Therapy',
    850,
    7,
    'M.A. in Marriage and Family Therapy - Addis Ababa University',
    'Hliti is a licensed family therapist with 7 years of experience. She specializes in marriage counseling, family relationships, and parenting support.'
);

-- Therapist 5: Addiction Counselor
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Dr. Tesfaye Woldemariam', 'tesfaye@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'tesfaye@biruhwellness.com'),
    'LIC-2024-005',
    'Addiction Counseling',
    950,
    9,
    'Ph.D. in Addiction Psychology - Jimma University',
    'Dr. Tesfaye is an addiction specialist with 9 years of experience. He helps patients struggling with alcohol, substance abuse, and behavioral addictions.'
);

-- Therapist 6: Grief Counselor
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('W/ro Selam Hailemariam', 'selam.h@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'selam.h@biruhwellness.com'),
    'LIC-2024-006',
    'Grief and Loss Counseling',
    800,
    6,
    'M.A. in Counseling Psychology - Addis Ababa University',
    'Selam specializes in grief, bereavement, and loss counseling. She supports patients dealing with the death of loved ones, end-of-life issues, and emotional healing.'
);

-- Therapist 7: Neuropsychologist
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Dr. Haylu Asefa', 'haylu@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'haylu@biruhwellness.com'),
    'LIC-2024-007',
    'Neuropsychology',
    1300,
    11,
    'Ph.D. in Neuropsychology - Oslo University',
    'Dr. Haylu is a neuropsychologist specializing in brain injuries, stroke recovery, dementia, and neurological disorders. He provides cognitive rehabilitation and assessment.'
);

-- Therapist 8: EMDR Therapist
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('W/ro Ehet Abraham', 'ehet@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'ehet@biruhwellness.com'),
    'LIC-2024-008',
    'EMDR Therapy',
    1100,
    7,
    'EMDR Certified Practitioner - EMDR Institute',
    'Ehet is a certified EMDR therapist specializing in trauma, PTSD, and anxiety. She uses Eye Movement Desensitization and Reprocessing (EMDR) to help patients heal from traumatic experiences.'
);

-- Therapist 9: Rehabilitation Counselor
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Dr. Yosef Tadesse', 'yosef@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'yosef@biruhwellness.com'),
    'LIC-2024-009',
    'Rehabilitation Counseling',
    850,
    8,
    'M.D. in Psychiatry - Addis Ababa University',
    'Dr. Yosef specializes in rehabilitation counseling, helping patients with physical disabilities, workplace stress, and vocational rehabilitation.'
);

-- Therapist 10: Mindfulness and Wellness Coach
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('W/ro Samira Gebremedhin', 'samira@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'therapist', true);

INSERT INTO therapists (user_id, license_number, specialization, consultation_fee, years_experience, education, bio) 
VALUES (
    (SELECT id FROM users WHERE email = 'samira@biruhwellness.com'),
    'LIC-2024-010',
    'Mindfulness and Wellness',
    750,
    5,
    'M.A. in Positive Psychology - Addis Ababa University',
    'Samira is a wellness coach specializing in mindfulness, meditation, and stress reduction. She helps patients improve their overall well-being and life balance.'
);

-- ============================================
-- 3. RECEPTIONISTS
-- ============================================
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Samira Gebre', 'samira.r@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'receptionist', true),
('Abiy Alemu', 'abiy.r@biruhwellness.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'receptionist', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 4. PATIENTS (20 Realistic Patients)
-- ============================================

-- Patient 1: Depression
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Tigist Desta', 'tigist@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'tigist@email.com'),
    '1995-04-15',
    'female',
    'Addis Ababa',
    'Bole',
    'Abiy Alemu',
    '+251-911-300001',
    'Ethiopian Insurance Corporation',
    'EIC-2024-001',
    'None',
    'Depression, Anxiety',
    'english',
    'single'
);

-- Patient 2: Work Stress
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Dawit Mekonnen', 'dawit@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'dawit@email.com'),
    '1988-09-22',
    'male',
    'Addis Ababa',
    'Kazanchis',
    'Selam Mekonnen',
    '+251-911-300002',
    'NYALA Insurance',
    'NY-2024-002',
    'Penicillin',
    'Hypertension',
    'english',
    'married'
);

-- Patient 3: Childhood Trauma
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Ruth Hailemariam', 'ruth@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'ruth@email.com'),
    '2000-07-10',
    'female',
    'Amhara',
    'Bahir Dar',
    'Abraham Hailemariam',
    '+251-918-400001',
    'None',
    'None',
    'None',
    'Childhood trauma, PTSD',
    'english',
    'single'
);

-- Patient 4: Addiction
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Samuel Tesfaye', 'samuel@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'samuel@email.com'),
    '1992-11-05',
    'male',
    'Oromia',
    'Adama',
    'Mikael Tesfaye',
    '+251-912-500001',
    'Ethiopian Insurance Corporation',
    'EIC-2024-003',
    'None',
    'Alcohol addiction, Depression',
    'english',
    'divorced'
);

-- Patient 5: Grief
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Kidist Alemu', 'kidist@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'kidist@email.com'),
    '1985-03-18',
    'female',
    'Addis Ababa',
    'Gurd Shola',
    'Henok Alemu',
    '+251-911-600001',
    'NYALA Insurance',
    'NY-2024-004',
    'None',
    'Grief, Insomnia',
    'english',
    'widowed'
);

-- Patient 6: Family Issues
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Abiy Abebe', 'abiy.a@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'abiy.a@email.com'),
    '1980-06-30',
    'male',
    'Addis Ababa',
    'Sar Bet',
    'Weinsh Abebe',
    '+251-911-700001',
    'Ethiopian Insurance Corporation',
    'EIC-2024-005',
    'Sulfa',
    'Diabetes',
    'english',
    'married'
);

-- Patient 7: Academic Stress
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Henok Gebreegziabher', 'henok@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'henok@email.com'),
    '2002-12-15',
    'male',
    'Tigray',
    'Mekelle',
    'Gebreegziabher Tesfaye',
    '+251-914-800001',
    'None',
    'None',
    'Academic stress, Social anxiety',
    'english',
    'single'
);

-- Patient 8: PTSD
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Zemen Meles', 'zemen@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'zemen@email.com'),
    '1990-08-25',
    'female',
    'Addis Ababa',
    'Ayat',
    'Meles Zewde',
    '+251-911-900001',
    'NYALA Insurance',
    'NY-2024-006',
    'None',
    'PTSD, Panic attacks',
    'english',
    'single'
);

-- Patient 9: Bipolar Disorder
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Meron Tekle', 'meron@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'meron@email.com'),
    '1993-02-28',
    'female',
    'Addis Ababa',
    'CMC',
    'Tekle Berhan',
    '+251-911-100001',
    'Ethiopian Insurance Corporation',
    'EIC-2024-007',
    'None',
    'Bipolar disorder',
    'english',
    'single'
);

-- Patient 10: Eating Disorder
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Eden Girmay', 'eden@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'eden@email.com'),
    '1998-07-19',
    'female',
    'Amhara',
    'Gondar',
    'Girmay Hailu',
    '+251-918-200001',
    'NYALA Insurance',
    'NY-2024-008',
    'None',
    'Eating disorder, Anxiety',
    'english',
    'single'
);

-- Patient 11: OCD
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Nathan Berhanu', 'nathan@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'nathan@email.com'),
    '1991-11-30',
    'male',
    'Oromia',
    'Jimma',
    'Berhanu Tesfaye',
    '+251-912-300001',
    'Ethiopian Insurance Corporation',
    'EIC-2024-009',
    'None',
    'OCD',
    'english',
    'single'
);

-- Patient 12: Postpartum Depression
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Sara Hailu', 'sara@email.com', '$2b$12$QmZ7x3I5rC9vH5EaN8pDxOUB5m5l5L5F5L5g5h5i5j5k5l5m5n5o5p5q5r5s', 'patient', true);
INSERT INTO patients (user_id, date_of_birth, gender, region, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_id, allergies, chronic_conditions, preferred_language, marital_status) 
VALUES (
    (SELECT id FROM users WHERE email = 'sara@email.com'),
    '1996-09-12',
    'female',
    'Addis Ababa',
    'Jemo',
    'Hailu Abebe',
    '+251-911-400001',
    'NYALA Insurance',
    'NY-2024-010',
    'None',
    'Postpartum depression, Insomnia',
    'english',
    'married'
);

-- ============================================
-- 5. STAFF SCHEDULES
-- ============================================

-- Dr. Alemayehu's Schedule
INSERT INTO staff_schedules (therapist_id, day_of_week, start_time, end_time) VALUES
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')), 1, '08:00:00', '18:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')), 2, '08:00:00', '18:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')), 3, '08:00:00', '18:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')), 4, '08:00:00', '18:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')), 5, '08:00:00', '18:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')), 6, '09:00:00', '14:00:00');

-- Dr. Mahebereselam's Schedule
INSERT INTO staff_schedules (therapist_id, day_of_week, start_time, end_time) VALUES
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')), 1, '09:00:00', '17:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')), 2, '09:00:00', '17:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')), 3, '09:00:00', '17:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')), 4, '09:00:00', '17:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')), 5, '09:00:00', '17:00:00');

-- Dr. Fikre's Schedule
INSERT INTO staff_schedules (therapist_id, day_of_week, start_time, end_time) VALUES
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')), 1, '10:00:00', '19:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')), 2, '10:00:00', '19:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')), 3, '10:00:00', '19:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')), 4, '10:00:00', '19:00:00'),
((SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')), 6, '09:00:00', '15:00:00');

-- ============================================
-- 6. APPOINTMENTS (Today + Future + Past)
-- ============================================

-- Today's Appointments
INSERT INTO appointments (patient_id, therapist_id, appointment_date, start_time, end_time, type, status, notes) VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'tigist@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    CURRENT_DATE,
    '09:00:00',
    '10:00:00',
    'initial',
    'confirmed',
    'First consultation for depression assessment'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'dawit@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')),
    CURRENT_DATE,
    '10:30:00',
    '11:30:00',
    'follow-up',
    'confirmed',
    'Follow-up for work stress management'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'ruth@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')),
    CURRENT_DATE,
    '13:00:00',
    '14:00:00',
    'initial',
    'scheduled',
    'First consultation for childhood trauma'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'samuel@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'tesfaye@biruhwellness.com')),
    CURRENT_DATE,
    '14:30:00',
    '15:30:00',
    'follow-up',
    'confirmed',
    'Addiction recovery follow-up'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'kidist@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'selam.h@biruhwellness.com')),
    CURRENT_DATE,
    '11:00:00',
    '12:00:00',
    'follow-up',
    'in_progress',
    'Grief counseling session'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'meron@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    CURRENT_DATE,
    '15:00:00',
    '16:00:00',
    'follow-up',
    'scheduled',
    'Bipolar disorder management'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'eden@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')),
    CURRENT_DATE,
    '16:30:00',
    '17:30:00',
    'follow-up',
    'scheduled',
    'Eating disorder treatment follow-up'
);

-- Future Appointments (Next Week)
INSERT INTO appointments (patient_id, therapist_id, appointment_date, start_time, end_time, type, status, notes) VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'henok@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'mahebereselam@biruhwellness.com')),
    CURRENT_DATE + INTERVAL '3 days',
    '09:00:00',
    '10:00:00',
    'initial',
    'scheduled',
    'Academic stress assessment'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'zemen@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'ehet@biruhwellness.com')),
    CURRENT_DATE + INTERVAL '4 days',
    '11:00:00',
    '12:00:00',
    'initial',
    'scheduled',
    'PTSD and panic attacks assessment'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'tigist@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    CURRENT_DATE + INTERVAL '7 days',
    '09:00:00',
    '10:00:00',
    'follow-up',
    'scheduled',
    'Depression follow-up session'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'nathan@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    CURRENT_DATE + INTERVAL '5 days',
    '14:00:00',
    '15:00:00',
    'initial',
    'scheduled',
    'OCD assessment'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'sara@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'selam.h@biruhwellness.com')),
    CURRENT_DATE + INTERVAL '6 days',
    '10:00:00',
    '11:00:00',
    'initial',
    'scheduled',
    'Postpartum depression assessment'
);

-- Past Appointments (Completed)
INSERT INTO appointments (patient_id, therapist_id, appointment_date, start_time, end_time, type, status, notes) VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'tigist@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    CURRENT_DATE - INTERVAL '7 days',
    '10:00:00',
    '11:00:00',
    'initial',
    'completed',
    'Initial depression assessment completed'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'dawit@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')),
    CURRENT_DATE - INTERVAL '5 days',
    '14:00:00',
    '15:00:00',
    'follow-up',
    'completed',
    'Work stress management session completed'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'samuel@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'tesfaye@biruhwellness.com')),
    CURRENT_DATE - INTERVAL '3 days',
    '11:00:00',
    '12:00:00',
    'follow-up',
    'completed',
    'Addiction recovery session completed'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'kidist@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'selam.h@biruhwellness.com')),
    CURRENT_DATE - INTERVAL '4 days',
    '15:00:00',
    '16:00:00',
    'follow-up',
    'completed',
    'Grief counseling session completed'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'abiy.a@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'hliti@biruhwellness.com')),
    CURRENT_DATE - INTERVAL '2 days',
    '13:00:00',
    '14:00:00',
    'follow-up',
    'completed',
    'Family therapy session completed'
);

-- ============================================
-- 7. SESSION NOTES (With realistic clinical content)
-- ============================================

INSERT INTO session_notes (
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
    suicidal_ideation,
    self_harm,
    medication_adherence,
    homework,
    next_session_goals
) VALUES (
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'tigist@email.com')) AND status = 'completed' LIMIT 1),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    'Patient reports feeling depressed and anxious for the past 3 months. She has difficulty sleeping and has lost interest in activities she used to enjoy. She feels hopeless about her situation.',
    'Patient appeared tearful during the session. Poor eye contact. Speech was slow and soft. She showed signs of psychomotor retardation.',
    'Major Depressive Disorder (MDD) - PHQ-9 score: 22/27. No active suicidal ideation, but reports passive thoughts of death. Anxiety level moderate (GAD-7: 15).',
    'Cognitive Behavioral Therapy (CBT) will be initiated. Weekly sessions for 12 weeks. Referral to psychiatrist for medication evaluation. Start mood journaling.',
    3,
    7,
    2,
    'decreased',
    false,
    false,
    'Not yet started',
    'Start a daily mood journal. Practice deep breathing exercises when feeling anxious.',
    'Review mood journal, introduce cognitive restructuring techniques.'
);

-- ============================================
-- 8. TREATMENT PLANS
-- ============================================

INSERT INTO treatment_plans (patient_id, therapist_id, diagnosis, goals, milestones, status) VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'tigist@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    'Major Depressive Disorder (F32.1)',
    '1. Reduce PHQ-9 score by 50% within 12 weeks
    2. Improve sleep quality (sleep at least 6 hours/night)
    3. Restore appetite to normal levels
    4. Increase engagement in previously enjoyed activities',
    'Week 1-4: Psychoeducation, mood tracking, behavioral activation
    Week 5-8: Cognitive restructuring, identifying negative thoughts
    Week 9-12: Relapse prevention, mindfulness techniques',
    'active'
);

-- ============================================
-- 9. INTAKE FORMS
-- ============================================

INSERT INTO intake_forms (patient_id, presenting_problem, history_of_presenting_illness, psychiatric_history, medical_history, family_history, social_history, substance_use) VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'tigist@email.com')),
    'Patient reports persistent sadness, loss of interest in activities, sleep disturbances, and decreased appetite for the past 3 months.',
    'Symptoms started gradually after a difficult breakup at work. Patient reports feeling overwhelmed and unable to cope with daily tasks.',
    'No previous psychiatric treatment. No history of psychiatric hospitalization.',
    'No significant medical history. Takes no regular medications.',
    'No family history of mental illness.',
    'Patient lives alone. Works as a project manager at a tech company. Has a good social network but has been isolating herself.',
    'No alcohol or substance use. No smoking.'
);

-- ============================================
-- 10. CRISIS INCIDENTS
-- ============================================

INSERT INTO crisis_incidents (patient_id, therapist_id, type, description, severity, intervention, outcome, is_resolved) VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'zemen@email.com')),
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'ehet@biruhwellness.com')),
    'Panic Attack',
    'Patient experienced severe panic attack during therapy session. Symptoms included rapid heart rate, shortness of breath, shaking, and fear of losing control.',
    'high',
    'Breathing exercises performed. Grounding techniques used. Patient was reassured and monitored until symptoms resolved.',
    'Patient calmed down after 20 minutes. Was able to complete the session.',
    true
);

-- ============================================
-- 11. LEAVE REQUESTS
-- ============================================

INSERT INTO leave_requests (therapist_id, start_date, end_date, reason, status) VALUES
(
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'alemayehu@biruhwellness.com')),
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '35 days',
    'Annual leave - Family vacation',
    'pending'
),
(
    (SELECT id FROM therapists WHERE user_id = (SELECT id FROM users WHERE email = 'fikre@biruhwellness.com')),
    CURRENT_DATE + INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '17 days',
    'Family medical emergency',
    'approved'
);

-- ============================================
-- 12. AUDIT LOGS
-- ============================================

INSERT INTO audit_logs (user_id, action, table_name, record_id, ip_address, user_agent) VALUES
(
    (SELECT id FROM users WHERE email = 'admin@biruhwellness.com'),
    'LOGIN',
    'users',
    (SELECT id FROM users WHERE email = 'admin@biruhwellness.com'),
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
);

