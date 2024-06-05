<template>
  <div class="left-sidebar-container">
    <div class="top-logo-name">
      <h1>Lumos</h1>
      <div class="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .572.729 6.016 6.016 0 0 0 2.856 0A.75.75 0 0 0 12 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z"
          />
        </svg>
      </div>
    </div>
    <div class="search-bar">
      <input type="text" placeholder="Search..." v-model="searchQuery" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="search-icon"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.477l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="chat-sections">
      <div class="current-chat">
        <h2>Current Chat</h2>
        <div class="current-chat-item" v-if="currentChat">
          <i
            class="bi bi-trash-fill delete-icon"
            @click="$emit('delete-current-chat', currentChat.id)"
          ></i>
          <span>{{ truncate(currentChat.uuid) }}</span>
        </div>
        <span v-else>No current chat</span>
      </div>
      <div class="previous-chats">
        <h2>Previous Chats</h2>
        <div v-if="filteredChats.length > 0">
          <div v-for="chat in filteredChats" :key="chat.id" class="chat-item">
            <span @click="selectChat(chat)">
              {{ truncate(chat.uuid) }}
            </span>
            <i
              class="bi bi-trash-fill delete-icon"
              @click="deleteChat(chat.id)"
            ></i>
          </div>
        </div>
        <span v-else>No previous chats</span>
      </div>
    </div>
    <div class="settings-link">
      <a href="#" @click.prevent="openSettingsModal">
        <i class="bi bi-gear-fill settings-icon"></i>
        Settings
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import db from "@/db";

export default {
  name: "LeftSidebar",
  props: {
    currentChat: Object,
    previousChats: Array,
  },
  data() {
    return {
      searchQuery: "",
      localPreviousChats: [],
    };
  },
  computed: {
    filteredChats() {
      if (!this.searchQuery) {
        return this.localPreviousChats;
      }
      return this.localPreviousChats.filter((chat) =>
        chat.uuid.includes(this.searchQuery)
      );
    },
  },
  methods: {
    ...mapActions(["openSettingsModal"]),
    async loadChats() {
      this.localPreviousChats = await db.chats.toArray();
    },
    async selectChat(chat) {
      this.$emit("chat-selected", chat.uuid); // Emit UUID instead of chat ID
    },
    async deleteChat(chatId) {
      await db.chats.delete(chatId);
      await db.messages.where({ chatId }).delete();
      this.localPreviousChats = this.localPreviousChats.filter(
        (chat) => chat.id !== chatId
      );
      if (this.currentChat && this.currentChat.id === chatId) {
        this.$emit("chat-deleted"); // Emit event to clear current chat
      }
    },
    truncate(text) {
      const maxLength = 15;
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    },
  },
  watch: {
    previousChats: {
      handler(newChats) {
        this.localPreviousChats = [...newChats];
      },
      immediate: true,
      deep: true,
    },
  },
  async mounted() {
    await this.loadChats();
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";

.left-sidebar-container {
  width: 180px;
  height: 100%;
  border-right: 1px solid $ResBorder;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: width 0.3s ease;

  .top-logo-name {
    @include flex(row, center, center);
    height: 3rem;

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: "Quicksand", sans-serif;
    }

    .icon-container {
      background-color: $ResWhite;
      border-radius: $ResRoundedEdges;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;

      svg {
        width: 20px;
        height: 20px;
        color: $ResPurple;
      }
    }
  }

  .search-bar {
    padding: 0.5rem;
    position: relative;

    input {
      width: 100%;
      padding: 0.25rem;
      padding-right: 2rem;
      border-radius: 5px;
      border: 1px solid $ResBorder;
      background-color: $ResGrey;
      color: $ResWhite;

      &::placeholder {
        color: $ResWhite;
      }

      &:focus {
        border-color: $ResPurple;
        outline: none;
      }
    }

    .search-icon {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      width: 1rem;
      height: 1rem;
      color: $ResWhite;
    }
  }

  .chat-sections {
    @include flex(column, flex-start, stretch);
    gap: 1.5rem;
    flex-grow: 1;
    margin-top: 1rem;

    .current-chat,
    .previous-chats {
      padding-left: 1rem;

      h2 {
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      span {
        font-size: 0.8rem;
        font-weight: 100;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }

      .current-chat-item {
        display: flex;
        align-items: center;
        position: relative;

        &:hover .delete-icon {
          opacity: 1;
        }

        .delete-icon {
          opacity: 0;
          cursor: pointer;
          transition: opacity 0.3s ease;
          margin-right: 0.5rem;
        }
      }

      .chat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        &:hover .delete-icon {
          opacity: 1;
        }

        .delete-icon {
          opacity: 0;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
      }
    }
  }

  .settings-link {
    height: 3rem;
    @include flex(row, flex-start, center);
    padding-left: 1rem;

    a {
      font-size: 1em;
      font-weight: 100;
      text-decoration: none;
      color: $ResWhite;
      display: flex;
      align-items: center;

      &:hover {
        color: $ResPurple;
      }

      .settings-icon {
        margin-right: 0.5rem;
        width: 1em;
        height: 1em;
      }
    }
  }
}
</style>
