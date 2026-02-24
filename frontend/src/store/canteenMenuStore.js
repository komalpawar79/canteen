import { create } from 'zustand';
import api from '../services/api';

const useCanteenMenuStore = create((set, get) => ({
  menuItems: [],
  loading: false,
  error: null,

  fetchMenu: async (canteenId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/canteen-dashboard/${canteenId}/menu`);
      const items = res.data.data?.items || res.data.items || [];
      set({ menuItems: items, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addItem: async (canteenId, itemData) => {
    try {
      const res = await api.post(`/canteen-dashboard/${canteenId}/menu`, itemData);
      const newItem = res.data.data?.item || res.data.item;
      if (newItem) {
        set((state) => ({ menuItems: [newItem, ...state.menuItems] }));
      }
    } catch (error) {
      throw error;
    }
  },

  updateItem: async (itemId, itemData) => {
    try {
      const res = await api.patch(`/canteen-dashboard/menu/${itemId}`, itemData);
      const updatedItem = res.data.data?.item || res.data.item;
      if (updatedItem) {
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item._id === itemId ? updatedItem : item
          ),
        }));
      }
    } catch (error) {
      throw error;
    }
  },

  toggleAvailability: async (itemId) => {
    try {
      const res = await api.patch(`/canteen-dashboard/menu/${itemId}/toggle`);
      const updatedItem = res.data.data?.item || res.data.item;
      if (updatedItem) {
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item._id === itemId ? updatedItem : item
          ),
        }));
      }
    } catch (error) {
      throw error;
    }
  },

  deleteItem: async (itemId) => {
    try {
      await api.delete(`/canteen-dashboard/menu/${itemId}`);
      set((state) => ({
        menuItems: state.menuItems.filter((item) => item._id !== itemId),
      }));
    } catch (error) {
      throw error;
    }
  },
}));

export default useCanteenMenuStore;
