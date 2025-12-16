import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/api';

export const fetchAllProducts = createAsyncThunk('admin/fetchAllProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`${API_URL}/products?limit=1000`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`${API_URL}/products`, productData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`${API_URL}/products/${id}`, productData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/products/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products: [],
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
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || action.payload.products || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        if (state.products && (action.payload.data || action.payload.product)) {
          state.products.push(action.payload.data || action.payload.product);
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const product = action.payload.data || action.payload.product;
        if (state.products && product) {
          const index = state.products.findIndex(p => p._id === product._id);
          if (index !== -1) {
            state.products[index] = product;
          }
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        if (state.products) {
          state.products = state.products.filter(p => p._id !== action.payload);
        }
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;