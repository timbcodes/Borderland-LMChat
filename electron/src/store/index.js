import { createStore } from "vuex";

export default createStore({
  state: {
    isSettingsModalOpen: false,
    isSidebarCollapsed: false,
  },
  mutations: {
    openSettingsModal(state) {
      state.isSettingsModalOpen = true;
    },
    closeSettingsModal(state) {
      state.isSettingsModalOpen = false;
    },
    toggleSidebar(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
  },
  actions: {
    openSettingsModal({ commit }) {
      commit("openSettingsModal");
    },
    closeSettingsModal({ commit }) {
      commit("closeSettingsModal");
    },
    toggleSidebar({ commit }) {
      commit("toggleSidebar");
    },
  },
  getters: {
    isSettingsModalOpen: (state) => state.isSettingsModalOpen,
    isSidebarCollapsed: (state) => state.isSidebarCollapsed,
  },
});
