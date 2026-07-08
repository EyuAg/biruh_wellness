const User = require('../models/User');
const Patient = require('../models/Patient');
const Therapist = require('../models/Therapist');
const { 
    generateAccessToken, 
    generateRefreshToken, 
    verifyRefreshToken,
    verifyAccessToken
} = require('../config/jwt');
const { logger } = require('../utils/logger');

// ============================================
// REGISTER
// ============================================
const register = async (req, res) => {
    try {
        const { email, password, full_name, phone, role, ethiopian_id } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                message: 'ኢሜይሉ ቀድሞ ተመዝግቧል - Email already registered'
            });
        }

        const user = await User.create({
            email,
            password,
            full_name,
            phone,
            role: 'patient',
            ethiopian_id
        });

        // Create patient profile
        await Patient.create({
            user_id: user.id,
            preferred_language: 'amharic'
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await User.updateRefreshToken(user.id, refreshToken);

        res.status(201).json({
            message: 'ተጠቃሚ በተሳካ ሁኔታ ተመዝግቧል - User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'ምዝገባ አልተሳካም - Registration failed: ' + error.message
        });
    }
};

// ============================================
// LOGIN
// ============================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔍 Login attempt:', email);

        const user = await User.findByEmail(email);
        console.log('📌 User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                message: 'ልክ ያልሆነ ኢሜይል ወይም የይለፍ ቃል - Invalid credentials'
            });
        }

        console.log('📌 User role:', user.role);
        console.log('📌 User active:', user.is_active);

        if (user.is_active === false) {
            return res.status(401).json({
                message: 'መለያዎ ተሰርዟል - Account deactivated'
            });
        }

        const isValidPassword = await User.comparePassword(password, user.password_hash);
        console.log('📌 Password valid:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'ልክ ያልሆነ ኢሜይል ወይም የይለፍ ቃል - Invalid credentials'
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await User.updateRefreshToken(user.id, refreshToken);

        console.log('✅ Login successful:', email);

        res.json({
            message: 'መግቢያ ተሳክቷል - Login successful',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            message: 'መግቢያ አልተሳካም - Login failed: ' + error.message
        });
    }
};

// ============================================
// REFRESH TOKEN
// ============================================
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: 'ሪፍሬሽ ቶከን ያስፈልጋል - Refresh token required'
            });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findByRefreshToken(refreshToken);

        if (!user || user.id !== decoded.userId) {
            return res.status(401).json({
                message: 'ልክ ያልሆነ ሪፍሬሽ ቶከን - Invalid refresh token'
            });
        }

        if (user.is_active === false) {
            return res.status(401).json({
                message: 'መለያዎ ተሰርዟል - Account deactivated'
            });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        await User.updateRefreshToken(user.id, newRefreshToken);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            message: 'ልክ ያልሆነ ወይም ጊዜ ያለፈበት ሪፍሬሽ ቶከን - Invalid or expired refresh token'
        });
    }
};

// ============================================
// LOGOUT
// ============================================
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            const user = await User.findByRefreshToken(refreshToken);
            if (user) {
                await User.updateRefreshToken(user.id, null);
            }
        }

        res.json({
            message: 'መውጫ ተሳክቷል - Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'መውጫ አልተሳካም - Logout failed'
        });
    }
};

// ============================================
// FORGOT PASSWORD
// ============================================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'ኢሜይል ያስፈልጋል - Email required'
            });
        }

        const user = await User.findByEmail(email);

        if (!user) {
            return res.json({
                message: 'የይለፍ ቃል ዳግም ማስተካከያ ኢሜይል ተልኳል - If the email exists, a password reset link has been sent'
            });
        }

        const resetToken = generateAccessToken({
            id: user.id,
            email: user.email
        });

        res.json({
            message: 'የይለፍ ቃል ዳግም ማስተካከያ ኢሜይል ተልኳል - Password reset email sent',
            resetToken: resetToken
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            message: 'የይለፍ ቃል ዳግም ማስተካከያ አልተሳካም - Password reset failed'
        });
    }
};

// ============================================
// RESET PASSWORD
// ============================================
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                message: 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት - Password must be at least 8 characters'
            });
        }

        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: 'ተጠቃሚ አልተገኘም - User not found'
            });
        }

        await User.updatePassword(user.id, newPassword);
        await User.updateRefreshToken(user.id, null);

        res.json({
            message: 'የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል - Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({
            message: 'ልክ ያልሆነ ወይም ጊዜ ያለፈበት ቶከን - Invalid or expired token'
        });
    }
};

// ============================================
// GET CURRENT USER
// ============================================
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'ተጠቃሚ አልተገኘም - User not found'
            });
        }

        res.json({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            ethiopian_id: user.ethiopian_id,
            is_active: user.is_active,
            created_at: user.created_at
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            message: 'የተጠቃሚ መረጃ ማምጣት አልተሳካም - Failed to get user info'
        });
    }
};

// ============================================
// ADMIN: CREATE THERAPIST
// ============================================
const createTherapist = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'የሳይኮሎጂስት አካውንት ለመፍጠር የአስተዳዳሪ ፈቃድ ያስፈልጋል - Admin permission required'
            });
        }

        const { email, password, full_name, phone, specialization, license_number, consultation_fee, years_experience, education, bio, ethiopian_id } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                message: 'ኢሜይሉ ቀድሞ ተመዝግቧል - Email already registered'
            });
        }

        const user = await User.create({
            email,
            password,
            full_name,
            phone,
            role: 'therapist',
            ethiopian_id
        });

        await Therapist.create({
            user_id: user.id,
            license_number: license_number || `LIC-${Date.now()}`,
            specialization: specialization || 'General Mental Health',
            consultation_fee: consultation_fee || 500,
            years_experience: years_experience || 0,
            education: education || '',
            bio: bio || ''
        });

        res.status(201).json({
            message: 'የሳይኮሎጂስት አካውንት በተሳካ ሁኔታ ተፈጥሯል - Therapist account created successfully',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Create therapist error:', error);
        res.status(500).json({
            message: 'የሳይኮሎጂስት አካውንት መፍጠር አልተሳካም - Failed to create therapist account'
        });
    }
};

// ============================================
// ADMIN: CREATE ADMIN
// ============================================
const createAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'የአስተዳዳሪ አካውንት ለመፍጠር የአስተዳዳሪ ፈቃድ ያስፈልጋል - Admin permission required'
            });
        }

        const { email, password, full_name, phone, ethiopian_id } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                message: 'ኢሜይሉ ቀድሞ ተመዝግቧል - Email already registered'
            });
        }

        const user = await User.create({
            email,
            password,
            full_name,
            phone,
            role: 'admin',
            ethiopian_id
        });

        res.status(201).json({
            message: 'የአስተዳዳሪ አካውንት በተሳካ ሁኔታ ተፈጥሯል - Admin account created successfully',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({
            message: 'የአስተዳዳሪ አካውንት መፍጠር አልተሳካም - Failed to create admin account'
        });
    }
};

// ============================================
// ✅ EXPORT ALL CONTROLLERS
// ============================================
module.exports = {
    register,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    createTherapist,
    createAdmin
};