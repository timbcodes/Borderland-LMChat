<template>
  <div class="topbar-main-container">
    <div class="left-buttons-container">
      <i
        class="bi bi-chevron-left"
        :class="{ rotated: isSidebarCollapsed }"
        @click="toggleSidebar"
        @mouseenter="showTooltip('Collapse Menu', $event)"
        @mouseleave="hideTooltip"
      ></i>
      <i
        class="bi bi-plus-circle"
        @click="createNewChat"
        @mouseenter="showTooltip('New Chat', $event)"
        @mouseleave="hideTooltip"
      ></i>
      <i
        class="bi bi-trash-fill"
        v-if="currentChat"
        @click="deleteCurrentChat"
        @mouseenter="showTooltip('Delete Current Chat', $event)"
        @mouseleave="hideTooltip"
      ></i>
    </div>
    <div class="middle-title-container">
      <span v-if="currentChat">{{ truncate(currentChat.uuid) }}</span>
      <span v-else>No Chat Selected</span>
    </div>
    <div class="right-logo-container">
      <img src="../../assets/borderland-logo.png" alt="logo" />
    </div>
    <Tooltip ref="tooltip" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Tooltip from "@/components/UI/ToolTip.vue";

export default {
  name: "TopBar",
  components: {
    Tooltip,
  },
  props: {
    currentChat: Object,
  },
  methods: {
    ...mapActions(["toggleSidebar"]),
    showTooltip(text, event) {
      this.$refs.tooltip.delayShow(text, event);
    },
    hideTooltip() {
      this.$refs.tooltip.cancelShow();
    },
    createNewChat() {
      this.$emit("create-new-chat");
    },
    deleteCurrentChat() {
      this.$emit("delete-current-chat", this.currentChat.id);
    },
    truncate(text) {
      const maxLength = 15;
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    },
  },
  computed: {
    ...mapGetters(["isSidebarCollapsed"]),
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";
.topbar-main-container {
  @include flex(row, space-between, center);
  padding: 0 1rem;
  height: 3rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid $ResBorder;
  position: relative; /* Make sure the tooltip can be positioned correctly */
  .left-buttons-container {
    display: flex;
    align-items: center;
    i {
      margin-right: 1rem;
      cursor: pointer;
      color: $ResPurple;
      transition: transform 0.3s ease;
      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
  .middle-title-container {
    display: flex;
    justify-content: center;
    flex: 1;
  }
  .right-logo-container {
    img {
      height: 1.5rem;
    }
  }
}
</style>
