import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { User, Mail, Calendar, Edit3, Coffee } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-container bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">👤</div>
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">My Profile</h1>
          <p className="text-amber-700">Manage your cafe account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200 text-center">
              <div className="bg-amber-700 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <User className="h-10 w-10 text-yellow-100" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2">{user.name}</h2>
              <p className="text-amber-700 font-serif mb-4">{user.email}</p>
              <div className="bg-amber-100 rounded-2xl p-4 mb-6">
                <p className="text-amber-800 font-serif text-sm">
                  <Coffee className="h-4 w-4 inline mr-2" />
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-amber-700 text-yellow-100 px-6 py-3 rounded-full font-serif font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200">
              <h3 className="text-2xl font-serif font-bold text-amber-900 mb-8 flex items-center">
                <span className="mr-3">📝</span> Account Information
              </h3>

              {isEditing ? (
                <form className="space-y-8">
                  <div>
                    <label className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                      👤 Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-amber-700 text-yellow-100 py-3 px-6 rounded-full font-serif font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-white text-amber-800 py-3 px-6 rounded-full font-serif font-bold hover:bg-amber-100 transition-all duration-300 border-2 border-amber-300"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-2xl">
                    <User className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="text-sm font-serif font-semibold text-amber-800">Full Name</p>
                      <p className="text-amber-900 font-serif text-lg">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-2xl">
                    <Mail className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="text-sm font-serif font-semibold text-amber-800">Email Address</p>
                      <p className="text-amber-900 font-serif text-lg">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-2xl">
                    <Calendar className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="text-sm font-serif font-semibold text-amber-800">Member Since</p>
                      <p className="text-amber-900 font-serif text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-2xl">
                    <Coffee className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="text-sm font-serif font-semibold text-amber-800">Account Type</p>
                      <p className="text-amber-900 font-serif text-lg capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200">
            <h3 className="text-2xl font-serif font-bold text-amber-900 mb-6 flex items-center">
              <span className="mr-3">⚡</span> Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/orders"
                className="bg-amber-100 hover:bg-amber-200 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 text-center"
              >
                <div className="text-3xl mb-3">📋</div>
                <h4 className="font-serif font-bold text-amber-900 mb-2">My Orders</h4>
                <p className="text-amber-700 font-serif text-sm">View order history</p>
              </a>
              
              <a
                href="/menu"
                className="bg-amber-100 hover:bg-amber-200 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 text-center"
              >
                <div className="text-3xl mb-3">☕</div>
                <h4 className="font-serif font-bold text-amber-900 mb-2">Browse Menu</h4>
                <p className="text-amber-700 font-serif text-sm">Discover new favorites</p>
              </a>
              
              <a
                href="/contact"
                className="bg-amber-100 hover:bg-amber-200 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 text-center"
              >
                <div className="text-3xl mb-3">💬</div>
                <h4 className="font-serif font-bold text-amber-900 mb-2">Contact Us</h4>
                <p className="text-amber-700 font-serif text-sm">Get in touch</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;