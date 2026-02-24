import { create } from 'zustand';
import api from '../services/api';

const useCanteenOrderStore = create((set) => ({
  newOrders: [],
  activeOrders: [],
  loading: false,
  error: null,

  fetchNewOrders: async (canteenId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/canteen-dashboard/${canteenId}/orders/new`);
      const orders = res.data.data?.orders || res.data.orders || [];
      set({ newOrders: orders, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchActiveOrders: async (canteenId) => {
    try {
      const res = await api.get(`/canteen-dashboard/${canteenId}/orders/active`);
      const orders = res.data.data?.orders || res.data.orders || [];
      set({ activeOrders: orders });
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      await api.patch(`/canteen-dashboard/orders/${orderId}/status`, { status });
      
      // Refresh orders after update
      set((state) => ({
        newOrders: state.newOrders.filter((o) => o._id !== orderId),
        activeOrders: state.activeOrders.map((o) =>
          o._id === orderId ? { ...o, status } : o
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));

export default useCanteenOrderStore;
