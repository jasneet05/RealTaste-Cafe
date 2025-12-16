import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Calendar, DollarSign, Eye, Edit } from 'lucide-react';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { useToast } from '../../contexts/ToastContext';
import OrderDetailModal from '../../components/ui/OrderDetailModal';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders: orders = [], loading } = useSelector(state => state.orders);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const toast = useToast();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
      toast.success('Order status updated successfully! ✅');
      setEditingOrder(null);
      setConfirmAction(null);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };



  const handleView = (order) => {
    setViewingOrder(order);
  };

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Orders Management</h1>
          <p className="text-amber-700">Monitor and manage customer orders</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl card-spacing">
            <div className="text-6xl mb-6">🛒</div>
            <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">No orders found</h3>
            <p className="text-amber-700 text-lg">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-2 border-amber-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Order ID</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Customer</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Phone</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Date</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Total</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Status</th>
                    <th className="table-header-spacing text-left text-xs font-medium text-amber-800 uppercase font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="table-cell-spacing whitespace-nowrap text-sm font-medium text-amber-900 font-serif">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">
                        {order.user?.name || 'Unknown'}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">
                        {order.mobileNumber || 'Not provided'}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm text-amber-800 font-serif font-bold">
                        ₹{order.totalAmount}
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full font-serif ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="table-cell-spacing whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleView(order)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-all"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => setEditingOrder(order)}
                            className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-50 transition-all"
                          >
                            <Edit className="h-5 w-5" />
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

        {editingOrder && (
          <StatusModal 
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onUpdate={handleStatusUpdate}
          />
        )}

        {viewingOrder && (
          <OrderDetailModal 
            order={viewingOrder}
            onClose={() => setViewingOrder(null)}
          />
        )}


        
        {actionLoading && <LoadingOverlay message="Updating order status..." />}
      </div>
    </AdminLayout>
  );
};

const ConfirmActionModal = ({ order, action, onConfirm, onClose }) => {
  const isAccept = action === 'accept';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl card-spacing w-full max-w-md border-2 border-amber-200">
        <div className="text-center mb-6">
          <div className={`text-4xl mb-4 ${isAccept ? 'text-green-600' : 'text-red-600'}`}>
            {isAccept ? '✅' : '❌'}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {isAccept ? 'Accept Order' : 'Reject Order'}
          </h3>
          <p className="text-gray-600">Order #{order._id.slice(-6)}</p>
          <p className="text-sm text-gray-500 mt-2">
            Customer: {order.user?.name || 'Unknown'}
          </p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-amber-800">
            {isAccept 
              ? 'This will start preparing the order and notify the customer.' 
              : 'This will cancel the order and notify the customer.'}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-3 px-4 rounded-lg font-semibold ${
              isAccept 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAccept ? 'Accept Order' : 'Reject Order'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusModal = ({ order, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(order._id, status);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl card-spacing w-full max-w-md border-2 border-amber-200">
        <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
        <p className="text-sm text-gray-600 mb-4">Order #{order._id.slice(-6)}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOrders;