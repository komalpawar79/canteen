import { create } from 'zustand';
import api from '../services/api';

const useCanteenAnalyticsStore = create((set) => ({
  kpis: null,
  popularItems: [],
  loading: false,
  error: null,

  fetchKPIs: async (canteenId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/canteen-dashboard/analytics/${canteenId}/kpis`);
      set({ kpis: res.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPopularItems: async (canteenId, days = 7) => {
    try {
      const res = await api.get(`/canteen-dashboard/analytics/${canteenId}/popular-items?days=${days}`);
      const items = res.data.data?.popularItems || res.data.popularItems || [];
      set({ popularItems: items });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useCanteenAnalyticsStore;
