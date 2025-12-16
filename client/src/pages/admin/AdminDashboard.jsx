import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { fetchAllProducts } from '../../store/slices/adminSlice';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { useToast } from '../../contexts/ToastContext';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { products = [] } = useSelector(state => state.admin);
  const { allOrders = [] } = useSelector(state => state.orders);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
      toast.success('Order status updated successfully!');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllProducts());
        await dispatch(fetchAllOrders());
        const { data } = await api.get('/api/users');
        setUsers(data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  const stats = [
    { title: 'Total Products', value: products.length, icon: Package, color: 'bg-amber-500' },
    { title: 'Total Users', value: users.length, icon: Users, color: 'bg-green-500' },
    { title: 'Total Orders', value: allOrders.length, icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">⚙️</div>
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Admin Dashboard</h1>
          <p className="text-amber-700">Manage your cafe operations</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-amber-700 font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold text-amber-900 font-serif">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-amber-600 hover:text-amber-800 font-serif text-sm">View All</Link>
          </div>
          {allOrders.length > 0 ? (
            <div className="grid gap-4">
              {allOrders.slice(0, 6).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm">
                      #{order._id.slice(-6)}
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-amber-900">{order.user?.name || 'Unknown'}</p>
                      <p className="text-amber-600 text-sm">{order.mobileNumber || 'No phone'}</p>
                      <p className="text-amber-500 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-serif font-bold text-amber-900 text-lg">₹{order.totalAmount}</p>
                      <p className="text-amber-600 text-xs">{order.items?.length || 0} items</p>
                    </div>
                    {order.status !== 'Cancelled' ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-amber-700 font-serif">No orders yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/products" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <Package className="h-12 w-12 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-amber-900 mb-2 font-serif">Manage Products</h3>
            <p className="text-amber-700 font-serif">Add, edit, or remove menu items</p>
          </Link>

          <Link to="/admin/orders" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <ShoppingCart className="h-12 w-12 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-amber-900 mb-2 font-serif">View Orders</h3>
            <p className="text-amber-700 font-serif">Monitor and manage customer orders</p>
          </Link>

          <Link to="/admin/categories" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <Package className="h-12 w-12 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-amber-900 mb-2 font-serif">Manage Categories</h3>
            <p className="text-amber-700 font-serif">Organize menu item categories</p>
          </Link>

          <Link to="/admin/users" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <Users className="h-12 w-12 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-amber-900 mb-2 font-serif">Manage Users</h3>
            <p className="text-amber-700 font-serif">View and manage user accounts</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;