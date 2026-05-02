import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Camera, Upload, Trash2, Check, X, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { userApi } from '../services/userService';

const countries = [
    { code: 'VN', name: 'Vietnam', flag: '��', phoneCode: '+84' },
    { code: 'US', name: 'United States', flag: '��', phoneCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '��', phoneCode: '+44' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', phoneCode: '+65' },
    { code: 'NG', name: 'Nigeria', flag: '�🇬', phoneCode: '+234' },
];

export default function SettingsPage() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        const hash = location.hash.replace('#', '');
        return ['profile', 'password', 'notifications', 'verification'].includes(hash) ? hash : 'profile';
    });
    const [avatar, setAvatar] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const user = JSON.parse(localStorage.getItem('user')) || {};

    // Update active tab when URL hash changes
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (['profile', 'password', 'notifications', 'verification'].includes(hash)) {
            setActiveTab(hash);
        }
    }, [location.hash]);

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: user.email || '',
        phoneCountry: countries[0],
        phoneNumber: '',
        gender: '',
        idNumber: '',
        taxId: '',
        taxCountry: countries[0],
        address: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        transactionAlerts: true,
        weeklyReports: false,
        marketingEmails: false,
    });

    const [verification, setVerification] = useState({
        emailVerified: true,
        phoneVerified: false,
        identityVerified: false,
        twoFactorEnabled: false,
    });

    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const avatarSelectorRef = useRef(null);

    // Close avatar selector when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (avatarSelectorRef.current && !avatarSelectorRef.current.contains(event.target)) {
                setShowAvatarSelector(false);
            }
        }
        if (showAvatarSelector) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showAvatarSelector]);

    // Preset avatar options from src/assets/avatar folder
    const presetAvatars = [
        '/src/assets/avatar/fghckv j.jpeg',
        '/src/assets/avatar/ccgfc.jpeg',
        '/src/assets/avatar/fyxcki.jpeg',
        '/src/assets/avatar/jhjvbl.jpeg',
        '/src/assets/avatar/kghcjvbn.jpeg',
        '/src/assets/avatar/xgchk.jpeg',
    ];

    // Only preview avatar, don't save yet
    const handleAvatarSelect = (avatarPath) => {
        setAvatar(avatarPath);
        setShowAvatarSelector(false);
        setSuccess('Avatar selected. Click "Save Profile" to apply changes.');
        setTimeout(() => setSuccess(''), 3000);
    };

    // Only preview remove avatar, don't save yet
    const handleDeleteAvatar = () => {
        setAvatar(null);
        setShowAvatarSelector(false);
        setSuccess('Avatar removed. Click "Save Profile" to apply changes.');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Fetch user profile on mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        if (!user.email) {
            setLoading(false);
            return;
        }
        try {
            const res = await userApi.getProfile(user.email);
            const data = res.data;

            // Split fullName into first and last name
            const nameParts = (data.fullName || '').split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Find country by code
            const phoneCountry = countries.find(c => c.code === data.phoneCountryCode) || countries[0];
            const taxCountry = countries.find(c => c.code === data.taxCountryCode) || countries[0];

            setProfileData({
                firstName,
                lastName,
                email: data.email || user.email,
                phoneCountry,
                phoneNumber: data.phoneNumber || '',
                gender: data.gender || '',
                idNumber: data.idNumber || '',
                taxId: data.taxIdNumber || '',
                taxCountry,
                address: data.residentialAddress || '',
            });

            if (data.avatarUrl) {
                setAvatar(data.avatarUrl);
            }

            setVerification({
                emailVerified: true,
                phoneVerified: !!data.phoneNumber,
                identityVerified: !!data.idNumber,
                twoFactorEnabled: false,
            });
        } catch (err) {
            setError('Failed to load profile data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
            const updateData = {
                fullName,
                avatarUrl: avatar,
                phoneNumber: profileData.phoneNumber,
                phoneCountryCode: profileData.phoneCountry.code,
                gender: profileData.gender,
                taxIdNumber: profileData.taxId,
                taxCountryCode: profileData.taxCountry.code,
                residentialAddress: profileData.address,
            };

            const response = await userApi.updateProfile(user.email, updateData);

            // Update localStorage with full profile data
            const updatedUser = {
                ...user,
                fullName,
                avatarUrl: avatar,
                phoneNumber: profileData.phoneNumber,
                phoneCountryCode: profileData.phoneCountry.code,
                gender: profileData.gender,
                taxIdNumber: profileData.taxId,
                taxCountryCode: profileData.taxCountry.code,
                residentialAddress: profileData.address,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Dispatch event to notify Layout to re-render
            window.dispatchEvent(new StorageEvent('storage', { key: 'user' }));

            setSuccess('Profile saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await userApi.changePassword(user.email, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setSuccess('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    const renderProfileSettings = () => (
        <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 relative">
                <div className="relative">
                    <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-emerald-50 border-2 border-emerald-100">
                        {avatar ? (
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 text-3xl font-bold">
                                {(profileData.firstName || profileData.lastName) ?
                                    `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}` : 'U'}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                        className="flex items-center gap-2 px-5 py-3 bg-[#106E4E] text-white rounded-2xl font-bold text-sm hover:bg-emerald-800 transition-all shadow-sm"
                    >
                        <Camera size={16} />
                        {avatar ? 'Change Avatar' : 'Select Avatar'}
                    </button>
                    {avatar && (
                        <button
                            onClick={handleDeleteAvatar}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium text-xs hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={14} />
                            Remove
                        </button>
                    )}
                </div>

                {/* Avatar Selector Popup */}
                {showAvatarSelector && (
                    <div
                        ref={avatarSelectorRef}
                        className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Choose Avatar
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {presetAvatars.map((avatarPath, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        handleAvatarSelect(avatarPath);
                                        setShowAvatarSelector(false);
                                    }}
                                    disabled={loading}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                                        avatar === avatarPath
                                            ? 'border-[#106E4E] ring-2 ring-emerald-500/20'
                                            : 'border-gray-200 hover:border-emerald-300'
                                    }`}
                                >
                                    <img
                                        src={avatarPath}
                                        alt={`Avatar ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/src/assets/avatar/default.jpeg';
                                        }}
                                    />
                                    {avatar === avatarPath && (
                                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                            <Check size={16} className="text-[#106E4E]" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        placeholder="First name"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        placeholder="Last name"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                    <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        placeholder="name@example.com"
                        className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-semibold text-gray-500 cursor-not-allowed"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex">
                        <div className="relative">
                            <select
                                value={profileData.phoneCountry.code}
                                onChange={(e) => {
                                    const country = countries.find(c => c.code === e.target.value);
                                    handleProfileChange('phoneCountry', country);
                                }}
                                className="appearance-none px-4 py-4 border border-r-0 border-gray-100 rounded-l-2xl bg-gray-50 focus:outline-none focus:border-[#106E4E] font-semibold"
                            >
                                {countries.map(c => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.phoneCode}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <input
                            type="tel"
                            value={profileData.phoneNumber}
                            onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                            placeholder="912 345 678"
                            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-r-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</label>
                    <div className="flex gap-4">
                        {['Male', 'Female'].map((gender) => (
                            <label key={gender} className={`flex items-center gap-3 px-5 py-4 border rounded-2xl cursor-pointer transition-all flex-1 font-semibold ${
                                profileData.gender === gender.toLowerCase()
                                    ? 'bg-emerald-50 border-[#106E4E] text-[#106E4E]'
                                    : 'border-gray-100 text-gray-600 hover:bg-gray-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value={gender.toLowerCase()}
                                    checked={profileData.gender === gender.toLowerCase()}
                                    onChange={(e) => handleProfileChange('gender', e.target.value)}
                                    className="w-4 h-4 text-[#106E4E] focus:ring-[#106E4E]"
                                />
                                <span className="text-sm">{gender}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID Number</label>
                    <input
                        type="text"
                        value={profileData.idNumber}
                        readOnly
                        placeholder="Auto-generated"
                        className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-semibold text-gray-500 cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tax Identification Number</label>
                    <input
                        type="text"
                        value={profileData.taxId}
                        onChange={(e) => handleProfileChange('taxId', e.target.value)}
                        placeholder="Enter tax ID"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tax Country</label>
                    <div className="relative">
                        <select
                            value={profileData.taxCountry.code}
                            onChange={(e) => {
                                const country = countries.find(c => c.code === e.target.value);
                                handleProfileChange('taxCountry', country);
                            }}
                            className="appearance-none w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                        >
                            {countries.map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.flag} {c.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Residential Address</label>
                <textarea
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    placeholder="Enter your residential address"
                    rows={3}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900 resize-none"
                />
            </div>

            <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-[#106E4E] text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-60"
            >
                {saving && <Loader2 size={18} className="animate-spin" />}
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );

    const renderPassword = () => (
        <div className="space-y-8 max-w-md">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Change Password</h3>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#106E4E] transition-all font-semibold text-gray-900"
                />
            </div>

            <button
                onClick={handleSavePassword}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-[#106E4E] text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-60"
            >
                {saving && <Loader2 size={18} className="animate-spin" />}
                {saving ? 'Updating...' : 'Update Password'}
            </button>
        </div>
    );

    const renderNotifications = () => (
        <div className="space-y-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Notification Preferences</h3>

            <div className="space-y-3">
                {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
                    { key: 'transactionAlerts', label: 'Transaction Alerts', desc: 'Get notified for all transactions' },
                    { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly financial summaries' },
                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional offers and news' },
                ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                            <p className="font-bold text-gray-900">{label}</p>
                            <p className="text-sm text-gray-500 font-medium mt-0.5">{desc}</p>
                        </div>
                        <button
                            onClick={() => handleNotificationChange(key)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${notifications[key] ? 'bg-[#106E4E]' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${notifications[key] ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setSuccess('Notification preferences saved!')}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-[#106E4E] text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-60"
            >
                {saving && <Loader2 size={18} className="animate-spin" />}
                Save Preferences
            </button>
        </div>
    );

    const renderVerification = () => (
        <div className="space-y-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Account Verification</h3>

            <div className="space-y-3">
                {[
                    { key: 'emailVerified', label: 'Email Verification', desc: 'Your email address has been verified', verified: verification.emailVerified },
                    { key: 'phoneVerified', label: 'Phone Verification', desc: 'Verify your phone number for added security', verified: verification.phoneVerified },
                    { key: 'identityVerified', label: 'Identity Verification', desc: 'Upload documents to verify your identity', verified: verification.identityVerified },
                    { key: 'twoFactorEnabled', label: 'Two-Factor Authentication', desc: 'Enable 2FA for enhanced account security', verified: verification.twoFactorEnabled },
                ].map(({ key, label, desc, verified }) => (
                    <div key={key} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${verified ? 'bg-emerald-100 text-[#106E4E]' : 'bg-gray-200 text-gray-500'}`}>
                                {verified ? <Check size={22} /> : <X size={22} />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{label}</p>
                                <p className="text-sm text-gray-500 font-medium">{desc}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (!verified) {
                                    setSuccess(`${label} process started!`);
                                    setVerification(prev => ({ ...prev, [key]: true }));
                                }
                            }}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                verified
                                    ? 'bg-emerald-100 text-[#106E4E] cursor-default'
                                    : 'bg-[#106E4E] text-white hover:bg-emerald-800 shadow-sm'
                            }`}
                        >
                            {verified ? 'Verified' : 'Verify'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
                </div>
            );
        }

        switch (activeTab) {
            case 'profile': return renderProfileSettings();
            case 'password': return renderPassword();
            case 'notifications': return renderNotifications();
            case 'verification': return renderVerification();
            default: return renderProfileSettings();
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
            {/* Alerts */}
            {/* Toast Notifications - Fixed Overlay */}
            {error && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top fade-in duration-300">
                    <div className="flex items-center gap-3 px-6 py-4 bg-rose-500 text-white rounded-2xl shadow-2xl font-semibold">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                </div>
            )}
            {success && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top fade-in duration-300">
                    <div className="flex items-center gap-3 px-6 py-4 bg-[#106E4E] text-white rounded-2xl shadow-2xl font-semibold">
                        <Check size={20} />
                        {success}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 lg:p-10">
                {renderContent()}
            </div>
        </div>
    );
}
