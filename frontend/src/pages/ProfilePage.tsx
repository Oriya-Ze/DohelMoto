import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { motion } from 'framer-motion';
import { 
  UserIcon,
  EnvelopeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
    avatar: user?.avatar || '',
  });

  const handleSave = async () => {
    try {
      // Here you would update the user profile via API
      console.log('Updating profile:', profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setProfile({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      country: 'United States',
      avatar: user?.avatar || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-blue-600" />
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {profile.name}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {profile.email}
              </p>
              
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                    >
                      <CheckIcon className="h-5 w-5" />
                      <span>Save</span>
                    </button>
                    
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="123 Main Street"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="New York"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={profile.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Account Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                    <p className="text-sm text-gray-500">Update your password</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Change
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Enable
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Manage your email preferences</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
