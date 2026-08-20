import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Shield, Lock, KeyRound, LogOut, Pencil, Check, Plus, Trash2, Heart, Star, Package, Ticket } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './Profile.css';

export default function Profile() {
  const { brandConfig } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    gender: 'Male',
    dob: '1995-06-15',
  });

  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', name: 'John Doe', phone: '+91 98765 43210', address: '123 Main Street, Apartment 4B', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
    { id: 2, type: 'Office', name: 'John Doe', phone: '+91 98765 43210', address: '456 Business Park, Tower A, 5th Floor', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', isDefault: false },
  ]);

  const stats = [
    { label: 'Orders', value: '12', icon: Package, color: '#2874F0' },
    { label: 'Wishlist', value: '8', icon: Heart, color: '#e11d48' },
    { label: 'Reviews', value: '5', icon: Star, color: '#f59e0b' },
    { label: 'Coupons', value: '3', icon: Ticket, color: '#8b5cf6' },
  ];

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* Header */}
        <header className="profile-header">
          <div className="profile-avatar">
            <span className="profile-avatar-text">{profile.firstName[0]}{profile.lastName[0]}</span>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{profile.firstName} {profile.lastName}</h1>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-member">Member since Jan 2024</p>
          </div>
        </header>

        {/* Stats */}
        <div className="profile-stats">
          {stats.map(stat => (
            <div key={stat.label} className="profile-stat-card">
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              <span className="profile-stat-value">{stat.value}</span>
              <span className="profile-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {[
            { key: 'profile', label: 'Profile Info', icon: User },
            { key: 'addresses', label: 'Addresses', icon: MapPin },
            { key: 'security', label: 'Security', icon: Shield },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Info Tab */}
        {activeTab === 'profile' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Personal Information</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`profile-edit-btn ${isEditing ? 'save' : ''}`}
              >
                {isEditing ? (saved ? <><Check className="w-3.5 h-3.5 inline mr-1" />Saved</> : 'Save') : <><Pencil className="w-3.5 h-3.5 inline mr-1" />Edit</>}
              </button>
            </div>

            <div className="profile-form">
              <div className="profile-form-row">
                <div className="profile-field">
                  <label className="profile-label">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="profile-input"
                  />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="profile-input"
                  />
                </div>
              </div>

              <div className="profile-form-row">
                <div className="profile-field">
                  <label className="profile-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={e => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="profile-input"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="profile-input"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="profile-form-row">
                <div className="profile-field">
                  <label className="profile-label">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={e => handleChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="profile-input"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      type="date"
                      value={profile.dob}
                      onChange={e => handleChange('dob', e.target.value)}
                      disabled={!isEditing}
                      className="profile-input"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Saved Addresses</h2>
              <button className="profile-add-btn flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add New
              </button>
            </div>

            <div className="profile-addresses">
              {addresses.map(addr => (
                <div key={addr.id} className={`profile-address ${addr.isDefault ? 'default' : ''}`}>
                  <div className="profile-address-header">
                    <MapPin className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} />
                    <span className="profile-address-type">{addr.type}</span>
                    {addr.isDefault && <span className="profile-address-badge">Default</span>}
                  </div>
                  <p className="profile-address-name">{addr.name}</p>
                  <p className="profile-address-text">{addr.address}</p>
                  <p className="profile-address-text">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="profile-address-phone">Phone: {addr.phone}</p>
                  <div className="profile-address-actions">
                    <button className="profile-addr-btn flex items-center gap-1">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    {!addr.isDefault && <button className="profile-addr-btn">Set Default</button>}
                    {!addr.isDefault && (
                      <button className="profile-addr-btn delete flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Security Settings</h2>
            </div>

            <div className="profile-security">
              <div className="profile-security-item">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(40,116,240,0.1)' }}>
                    <KeyRound className="w-5 h-5" style={{ color: '#2874F0' }} />
                  </div>
                  <div className="profile-security-info">
                    <h3 className="profile-security-title">Password</h3>
                    <p className="profile-security-desc">Last changed 3 months ago</p>
                  </div>
                </div>
                <button className="profile-security-btn">Change Password</button>
              </div>

              <div className="profile-security-item">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <Shield className="w-5 h-5" style={{ color: '#10b981' }} />
                  </div>
                  <div className="profile-security-info">
                    <h3 className="profile-security-title">Two-Factor Authentication</h3>
                    <p className="profile-security-desc">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="profile-security-btn enable">Enable</button>
              </div>

              <div className="profile-security-item">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                    <LogOut className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  </div>
                  <div className="profile-security-info">
                    <h3 className="profile-security-title">Login Sessions</h3>
                    <p className="profile-security-desc">Manage your active sessions</p>
                  </div>
                </div>
                <button className="profile-security-btn">View Sessions</button>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="profile-danger">
          <h3 className="profile-danger-title">Danger Zone</h3>
          <p className="profile-danger-desc">Once you delete your account, there is no going back.</p>
          <button className="profile-danger-btn flex items-center gap-2 mx-auto">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </main>
  );
}
