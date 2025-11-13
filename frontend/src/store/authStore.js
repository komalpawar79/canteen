import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Login failed'
        };
      }
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        set({ 
          user: data.user, 
          token: data.token, 
          isAuthenticated: true 
        });
      }
      return data;
    } catch (error) {
      console.error('Login fetch error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection.'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Signup failed'
        };
      }
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        set({ 
          user: data.user, 
          token: data.token, 
          isAuthenticated: true 
        });
      }
      return data;
    } catch (error) {
      console.error('Signup fetch error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection.'
      };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
