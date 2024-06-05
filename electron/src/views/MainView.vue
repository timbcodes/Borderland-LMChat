<template>
  <div class="main-container">
    <div class="main-window-container">
      <div
        class="left-sidebar-container"
        :class="{ collapsed: isSidebarCollapsed }"
      >
        <LeftSidebar
          @chat-selected="loadChatMessages"
          :currentChat="currentChat"
          :previousChats="previousChats"
          @delete-current-chat="deleteCurrentChat"
        />
      </div>
      <div class="main-content-container">
        <div class="top-bar-container">
          <TopBar
            @create-new-chat="createNewChat"
            :currentChat="currentChat"
            @delete-current-chat="deleteCurrentChat"
          />
        </div>
        <div class="main-chat-view-container">
          <MainChatView
            ref="mainChatView"
            @new-chat-created="updateCurrentChat"
            @move-to-previous-chats="addPreviousChat"
          />
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
import db from "@/db";

export default {
  name: "MainView",
  components: {
    LeftSidebar,
    TopBar,
    MainChatView,
    SettingsModal,
  },
  data() {
    return {
      currentChat: null,
      previousChats: [],
    };
  },
  methods: {
    ...mapActions(["closeSettingsModal"]),
    async loadChatMessages(chatUuid) {
      const chat = await db.chats.where({ uuid: chatUuid }).first();
      if (chat) {
        const messages = await db.messages.where({ chatId: chat.id }).toArray();
        this.updateCurrentChat(chat);
        this.$refs.mainChatView.setMessages(messages);
      }
    },
    updateCurrentChat(chat) {
      if (this.currentChat) {
        this.previousChats.push(this.currentChat);
      }
      this.currentChat = chat;
      this.previousChats = this.previousChats.filter((c) => c.id !== chat.id);
    },
    addPreviousChat(chat) {
      if (!this.previousChats.find((c) => c.id === chat.id)) {
        this.previousChats.push(chat);
      }
    },
    async createNewChat() {
      if (this.currentChat) {
        this.addPreviousChat(this.currentChat);
        this.$refs.mainChatView.clearChat();
      }
      await this.$refs.mainChatView.createNewChat();
    },
    async deleteCurrentChat(chatId) {
      if (this.currentChat && this.currentChat.id === chatId) {
        await db.chats.delete(chatId);
        await db.messages.where({ chatId }).delete();
        this.currentChat = null;
        this.$refs.mainChatView.clearChat();
      }
      this.previousChats = this.previousChats.filter(
        (chat) => chat.id !== chatId
      );
    },
  },
  computed: {
    ...mapGetters(["isSettingsModalOpen", "isSidebarCollapsed"]),
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
