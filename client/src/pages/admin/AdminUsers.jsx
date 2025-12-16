import { useEffect, useState } from 'react';
import { Users, Mail, Calendar, Shield, Edit, Ban, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../contexts/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users');
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const { data } = await api.put(`/api/users/${editingUser._id}`, {
        role: editingUser.role,
        isActive: editingUser.isActive
      });
      
      if (data.success) {
        setUsers(users.map(user => 
          user._id === editingUser._id ? { ...user, ...editingUser } : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
        toast.success('User updated successfully! ✅');
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { data } = await api.put(`/api/users/${userId}`, {
        isActive: !currentStatus
      });
      
      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        ));
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully! ✅`);
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">👥</div>
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Users Management</h1>
          <p className="text-amber-700">View and manage user accounts</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl card-spacing">
            <div className="text-6xl mb-6">👥</div>
            <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">No users found</h3>
            <p className="text-amber-700 text-lg">Registered users will appear here</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-2 border-amber-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">User</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Email</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Role</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Joined</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="table-cell-spacing whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="text-amber-600 font-bold font-serif text-lg">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-amber-900 font-serif">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">
                        {user.email}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full font-serif ${
                            user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-all"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(user._id, user.isActive !== false)}
                            className={`p-2 rounded-full transition-all ${
                              user.isActive !== false 
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            title={user.isActive !== false ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive !== false ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">Edit User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingUser.isActive !== false}
                      onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active User</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Update User
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;