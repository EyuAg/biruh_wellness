import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Calendar, MapPin, AlertCircle, Save, Loader2 } from 'lucide-react';
import PatientShell from './PatientShell';

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    region: '',
    city: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    insurance_provider: '',
    insurance_id: '',
    allergies: '',
    chronic_conditions: '',
    preferred_language: 'amharic',
    marital_status: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients/me');
      
      // The response should contain both user and patient data
      const data = res.data || {};
      
      setProfile(prev => ({
        ...prev,
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
        region: data.region || '',
        city: data.city || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        insurance_provider: data.insurance_provider || '',
        insurance_id: data.insurance_id || '',
        allergies: data.allergies || '',
        chronic_conditions: data.chronic_conditions || '',
        preferred_language: data.preferred_language || 'amharic',
        marital_status: data.marital_status || ''
      }));
      
    } catch (error) {
      console.error('Load profile error:', error);
      toast.error(error.response?.data?.message || 'Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.full_name || profile.full_name.length < 2) {
      newErrors.full_name = 'Full name is required (minimum 2 characters)';
    }
    
    if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!profile.phone || profile.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required (10+ digits)';
    }
    
    if (profile.emergency_contact_phone && profile.emergency_contact_phone.length < 10) {
      newErrors.emergency_contact_phone = 'Valid emergency phone number required (10+ digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        toast.error('Please fix the errors in the form');
        return;
    }
    
    setSaving(true);
    
    try {
        // ✅ ONLY send patient fields (not full_name or phone)
        const patientData = {
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            region: profile.region,
            city: profile.city,
            emergency_contact_name: profile.emergency_contact_name,
            emergency_contact_phone: profile.emergency_contact_phone,
            insurance_provider: profile.insurance_provider,
            insurance_id: profile.insurance_id,
            allergies: profile.allergies,
            chronic_conditions: profile.chronic_conditions,
            preferred_language: profile.preferred_language,
            marital_status: profile.marital_status
        };
        
        // ✅ Update patient profile (only patient fields)
        await api.put('/patients/me', patientData);
        
        toast.success('Profile updated successfully! ✅');
        
        // Refresh profile data
        await loadProfile();
        
    } catch (error) {
        console.error('Update profile error:', error);
        const message = error.response?.data?.message || 'Failed to update profile';
        toast.error(message);
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
      <PatientShell title="My Profile" subtitle="Keep your medical and contact details current.">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </PatientShell>
    );
  }

  return (
    <PatientShell title="My Profile" subtitle="Keep your medical and contact details current.">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-blue-600 mb-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
          <p className="mt-1 text-gray-600">Keep your medical and contact details current.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profile.full_name || ''}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      className={`w-full px-3 py-2 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Enter your full name"
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.full_name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Enter your email"
                      disabled
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profile.date_of_birth || ''}
                      onChange={(e) => handleChange('date_of_birth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={profile.gender || ''}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marital Status
                    </label>
                    <select
                      value={profile.marital_status || ''}
                      onChange={(e) => handleChange('marital_status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select marital status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Location
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <input
                      type="text"
                      value={profile.region || ''}
                      onChange={(e) => handleChange('region', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.city || ''}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-red-500" />
                  Emergency Contact
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={profile.emergency_contact_name || ''}
                      onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.emergency_contact_phone || ''}
                      onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                      className={`w-full px-3 py-2 border ${errors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Emergency phone number"
                    />
                    {errors.emergency_contact_phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.emergency_contact_phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Insurance & Medical Info */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-green-600" />
                  Insurance & Medical Information
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={profile.insurance_provider || ''}
                      onChange={(e) => handleChange('insurance_provider', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Insurance provider name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance ID
                    </label>
                    <input
                      type="text"
                      value={profile.insurance_id || ''}
                      onChange={(e) => handleChange('insurance_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Insurance ID number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={profile.allergies || ''}
                      onChange={(e) => handleChange('allergies', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="List any allergies"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chronic Conditions
                    </label>
                    <input
                      type="text"
                      value={profile.chronic_conditions || ''}
                      onChange={(e) => handleChange('chronic_conditions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="List any chronic conditions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={profile.preferred_language || 'amharic'}
                      onChange={(e) => handleChange('preferred_language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="amharic">አማርኛ - Amharic</option>
                      <option value="english">English</option>
                      <option value="oromic">Oromiffa - Oromic</option>
                      <option value="tigrigna">ትግርኛ - Tigrigna</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={loadProfile}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PatientShell>
  );
};

export default PatientProfile;
