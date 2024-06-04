<template>
  <div class="main-container">
    <div class="main-window-container">
      <div class="left-sidebar-container">
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
  </div>
</template>
<script>
import LeftSidebar from "@/components/UI/LeftSidebar.vue";
import TopBar from "@/components/UI/TopBar.vue";
import MainChatView from "@/components/MainView/MainChatView.vue";
export default {
  name: "MainView",
  components: {
    LeftSidebar,
    TopBar,
    MainChatView,
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
      height: 100%;
      border-right: 1px solid $ResBorder;
    }
    .main-content-container {
      width: calc(100% - 150px);
      height: 100%;
      .top-bar-container {
        height: 3rem;
      }
      .main-chat-view-container {
        height: calc(100% - 3rem);
      }
    }
  }
}
</style>
