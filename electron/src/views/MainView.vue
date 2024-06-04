<template>
  <div class="main-container">
    <div class="main-window-container">
      <div
        class="left-sidebar-container"
        :class="{ collapsed: isSidebarCollapsed }"
      >
        <LeftSidebar />
      </div>
      <div class="main-content-container">
        <div class="top-bar-container">
          <TopBar />
        </div>
        <div class="main-chat-view-container">
          <MainChatView />
        </div>
      </div>
    </div>
    <SettingsModal v-if="isSettingsModalOpen" @close="closeSettingsModal" />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import LeftSidebar from "@/components/UI/LeftSidebar.vue";
import TopBar from "@/components/UI/TopBar.vue";
import MainChatView from "@/components/MainView/MainChatView.vue";
import SettingsModal from "@/components/UI/SettingsModal.vue";

export default {
  name: "MainView",
  components: {
    LeftSidebar,
    TopBar,
    MainChatView,
    SettingsModal,
  },
  computed: {
    ...mapGetters(["isSettingsModalOpen", "isSidebarCollapsed"]),
  },
  methods: {
    ...mapActions(["closeSettingsModal"]),
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";
.main-container {
  width: 100%;
  height: 100%;
  .main-window-container {
    @include flex(row, space-between, stretch);
    height: 100%;
    .left-sidebar-container {
      width: 180px;
      transition: width 0.3s ease;
      overflow: hidden;
      &.collapsed {
        width: 0;
      }
    }
    .main-content-container {
      width: calc(100% - 180px);
      transition: width 0.3s ease;
      height: 100%;
      transition: width 0.3s ease;
      .top-bar-container {
        height: 3rem;
      }
      .main-chat-view-container {
        height: calc(100% - 3rem);
      }
    }
    .left-sidebar-container.collapsed + .main-content-container {
      width: 100%;
    }
  }
}
</style>
