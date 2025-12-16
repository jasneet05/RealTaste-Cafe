import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://realtaste.onrender.com' 
      : 'http://localhost:5000');
  return `${baseUrl}/api/products`;
};
const API_URL = getApiUrl();

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}?limit=1000`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    // Try featured products first, fallback to regular products
    let data;
    try {
      const response = await axios.get(`${API_URL}/featured`);
      data = response.data;
    } catch (featuredError) {
      // Fallback: Get regular products and take first 6
      const response = await axios.get(API_URL);
      const allProducts = response.data.data || response.data.products || [];
      data = {
        data: allProducts.slice(0, 6),
        success: true
      };
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    featuredProducts: [],
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.data || action.payload.products || [];
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;