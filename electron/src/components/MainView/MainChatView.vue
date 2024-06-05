<template>
  <div class="chat-app">
    <div v-if="!currentChat" class="no-chat-view">
      <div class="logo-container">
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
      <p>What can I help you with today?</p>
    </div>
    <div v-else class="chat-messages" ref="chatMessages">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message">
        <div class="message-content">
          {{ msg.text }}
        </div>
      </div>
    </div>
    <div class="chat-input-container">
      <div class="chat-input-wrapper">
        <textarea
          v-model="message"
          @input="resizeTextarea"
          @keydown.enter.prevent="sendMessage"
          placeholder="Ask anything!"
          class="chat-input"
          ref="chatInput"
        ></textarea>
        <button @click="sendMessage" class="chat-submit-button">
          <i class="bi bi-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import db from "@/db";

export default {
  name: "MainChatView",
  data() {
    return {
      currentChat: null,
      message: "",
      messages: [], // Messages array to store chat messages
      maxHeight: 150, // Maximum height for the text area
    };
  },
  methods: {
    async createNewChat() {
      if (this.currentChat) {
        // Add the current chat to previous chats before creating a new one
        this.$emit("move-to-previous-chats", this.currentChat);
      }
      const newChat = {
        uuid: uuidv4(),
        createdAt: new Date(),
      };
      const chatId = await db.chats.add(newChat);
      this.currentChat = { id: chatId, ...newChat };
      this.$emit("new-chat-created", this.currentChat);
    },
    async addMessageToChat(text) {
      const newMessage = {
        chatId: this.currentChat.id,
        text,
        createdAt: new Date(),
      };
      console.log("Saving message:", newMessage); // Add this line
      await db.messages.add(newMessage);
      this.messages.push(newMessage);
    },
    async sendMessage() {
      if (this.message.trim()) {
        if (!this.currentChat) {
          await this.createNewChat();
        }
        await this.addMessageToChat(this.message);
        // Scroll to the bottom of the chat messages
        this.$nextTick(() => {
          const chatMessages = this.$refs.chatMessages;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
        // Clear the message input
        this.message = "";
        this.$refs.chatInput.style.height = "3rem"; // Reset height after sending the message
      }
    },
    async loadChatMessages(chatId) {
      console.log(`Loading messages for chatId: ${chatId}`); // Debugging statement
      this.messages = await db.messages.where({ chatId }).toArray();
      console.log("Loaded messages:", this.messages); // Debugging statement
    },
    setMessages(messages) {
      this.messages = messages;
    },
    clearChat() {
      this.currentChat = null;
      this.messages = [];
    },
    resizeTextarea() {
      const textarea = this.$refs.chatInput;
      textarea.style.height = "auto"; // Reset height
      if (textarea.scrollHeight <= this.maxHeight) {
        textarea.style.height = textarea.scrollHeight + "px";
      } else {
        textarea.style.height = this.maxHeight + "px";
      }
      if (!this.message.trim()) {
        textarea.style.height = "3rem"; // Set to 3rem when there's no text
      }
    },
  },
  async mounted() {
    console.log(db.messages); // Debugging statement
    // Example: Load messages for an existing chat
    // const existingChatId = 1; // Replace with your logic to get an existing chat ID
    // await this.loadChatMessages(existingChatId);
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $ResSmoke;
  font-family: $mainFont;
  .no-chat-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      h1 {
        font-size: 2rem;
        font-weight: 700;
        font-family: "Quicksand", sans-serif;
        margin-right: 1rem;
      }
      .icon-container {
        background-color: $ResWhite;
        border-radius: $ResRoundedEdges;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          width: 24px;
          height: 24px;
          color: $ResPurple;
        }
      }
    }
    p {
      font-size: 1.2rem;
      font-weight: 400;
    }
  }
  .chat-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse; /* Start from bottom and work up */
    background-color: $ResSmoke; /* Ensure the background color remains consistent */
    .chat-message {
      margin-bottom: 1rem;
      display: flex;
      justify-content: flex-end; /* Align user messages to the right */
      .message-content {
        background-color: $ResWhite;
        border-radius: $ResRoundedEdges;
        padding: 0.5rem;
        font-family: $mainFont;
        color: $ResSmoke; /* Ensure text color is correct */
        max-width: 40%; /* Reduce the width of the message bubbles */
      }
    }
  }
  .chat-input-container {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    background-color: $ResSmoke;
    position: relative;
    .chat-input-wrapper {
      position: relative;
      display: flex;
      align-items: flex-end;
      width: 100%;
      max-width: 600px;
    }
    .chat-input {
      flex: 1;
      padding: 0.5rem 2.5rem 0.5rem 0.5rem;
      border: 1px solid $ResBorder;
      border-radius: $ResRoundedEdges;
      resize: none;
      overflow: hidden;
      max-height: 150px;
      background-color: $ResLighterGrey;
      color: $ResWhite;
      font-family: $mainFont;
      height: 3rem;
      transition: height 0.2s;
      &:focus {
        outline: none;
        border-color: $ResPurple;
      }
      &::placeholder {
        color: $ResWhite;
        text-align: start;
        vertical-align: middle;
      }
    }
    .chat-submit-button {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
      background-color: $ResPurple;
      border: none;
      border-radius: 50%;
      color: $ResWhite;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        font-size: 0.875rem;
      }
      &:hover {
        background-color: $ResDarkPurple;
      }
    }
  }
}
</style>
