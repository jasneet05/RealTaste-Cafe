import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/orders/my-orders');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/orders/all');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/orders/${id}/status`, { status });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    userOrders: [],
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload.data || action.payload.orders || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.data || action.payload.orders || [];
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data || action.payload.order;
        if (updatedOrder) {
          const index = state.allOrders.findIndex(order => order._id === updatedOrder._id);
          if (index !== -1) {
            // Preserve mobile number from original order if not in updated order
            state.allOrders[index] = {
              ...state.allOrders[index],
              ...updatedOrder,
              mobileNumber: updatedOrder.mobileNumber || state.allOrders[index].mobileNumber
            };
          }
        }
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;