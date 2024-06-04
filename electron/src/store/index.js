import { createStore } from "vuex";

export default createStore({
  state: {
    isSettingsModalOpen: false,
  },
  mutations: {
    openSettingsModal(state) {
      state.isSettingsModalOpen = true;
    },
    closeSettingsModal(state) {
      state.isSettingsModalOpen = false;
    },
  },
  actions: {
    openSettingsModal({ commit }) {
      commit("openSettingsModal");
    },
    closeSettingsModal({ commit }) {
      commit("closeSettingsModal");
    },
  },
  getters: {
    isSettingsModalOpen: (state) => state.isSettingsModalOpen,
  },
});
