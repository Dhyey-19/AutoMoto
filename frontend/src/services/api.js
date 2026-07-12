import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('automoto_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('automoto_token');
        localStorage.removeItem('automoto_user');
        // Redirect to login page if we are on a protected client route
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    
    // Extract user-friendly message
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    error.friendlyMessage = message;
    
    return Promise.reject(error);
  }
);

// --- Auth Services ---
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { success: true, data: { user, token } }
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data; // { success: true, data: { user, token } }
  },
};

// --- Vehicle Services ---
export const vehicleService = {
  getVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data; // { success: true, data: [vehicles] }
  },
  getFeaturedVehicles: async () => {
    const response = await api.get('/vehicles/featured');
    return response.data; // { success: true, data: [vehicles] }
  },
  getTransactions: async () => {
    const response = await api.get('/vehicles/transactions');
    return response.data; // { success: true, data: [transactions] }
  },
  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data; // { success: true, data: vehicle }
  },
  searchVehicles: async (filters = {}) => {
    // Clean empty values out of query parameters
    const cleanFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        cleanFilters[key] = filters[key];
      }
    });
    
    const response = await api.get('/vehicles/search', { params: cleanFilters });
    return response.data; // { success: true, data: [vehicles] }
  },
  purchaseVehicle: async (id, payload = { Quantity: 1, Remarks: 'Online purchase' }) => {
    const response = await api.post(`/vehicles/${id}/purchase`, payload);
    return response.data; // { success: true, message: '...', data: transaction }
  },
  
  // Admin-only services
  createVehicle: async (vehicleData) => {
    // Convert necessary strings to numbers as expected by backend validation
    const payload = {
      ...vehicleData,
      CategoryId: parseInt(vehicleData.CategoryId, 10),
      ManufactureYear: parseInt(vehicleData.ManufactureYear, 10),
      Price: parseFloat(vehicleData.Price),
      Quantity: parseInt(vehicleData.Quantity, 10),
    };
    const response = await api.post('/vehicles', payload);
    return response.data; // { success: true, data: vehicle }
  },
  updateVehicle: async (id, vehicleData) => {
    const payload = {
      ...vehicleData,
      CategoryId: parseInt(vehicleData.CategoryId, 10),
      ManufactureYear: parseInt(vehicleData.ManufactureYear, 10),
      Price: parseFloat(vehicleData.Price),
      Quantity: parseInt(vehicleData.Quantity, 10),
    };
    const response = await api.put(`/vehicles/${id}`, payload);
    return response.data; // { success: true, data: vehicle }
  },
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data; // { success: true, message: '...' }
  },
  restockVehicle: async (id, payload = { Quantity: 10, Remarks: 'Inventory restock' }) => {
    const response = await api.post(`/vehicles/${id}/restock`, payload);
    return response.data; // { success: true, message: '...', data: transaction }
  },
};

// --- User Management Services ---
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/users/${id}/status`, { isActive });
    return response.data;
  },
};

// --- Category Services ---
export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  createCategory: async (categoryName) => {
    const response = await api.post('/categories', { CategoryName: categoryName });
    return response.data;
  },
};

export default api;
