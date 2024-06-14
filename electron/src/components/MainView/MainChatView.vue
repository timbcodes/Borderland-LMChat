<template>
  <div class="chat-app">
    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="[
          'chat-message-wrapper',
          {
            'user-message': msg.role === 'user',
            'system-message': msg.role === 'system',
          },
        ]"
      >
        <div class="chat-message">
          <div class="message-content" v-html="msg.text"></div>
        </div>
      </div>
    </div>
    <div class="chat-input-container">
      <div class="chat-input-wrapper">
        <textarea
          v-model="message"
          @input="resizeTextarea"
          @keydown.enter.prevent="sendMessage"
          :placeholder="isLoading ? 'Waiting for response...' : 'Ask anything!'"
          :disabled="isLoading"
          class="chat-input"
          ref="chatInput"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="isLoading"
          class="chat-submit-button"
        >
          <i class="bi bi-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import db from "@/db";
import axios from "axios";

export default {
  name: "MainChatView",
  data() {
    return {
      currentChat: null,
      message: "",
      messages: [], // Messages array to store chat messages
      maxHeight: 150, // Maximum height for the text area
      isLoading: false, // Loading state for the chat
    };
  },
  methods: {
    async createNewChat() {
      if (this.currentChat) {
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
    async addMessageToChat(text, role = "user") {
      const newMessage = {
        chatId: this.currentChat.id,
        text,
        role,
        createdAt: new Date(),
      };
      await db.messages.add(newMessage);
      this.messages.push(newMessage); // Add new message at the end
      this.scrollToBottom(); // Scroll to the bottom after adding a new message
    },
    async sendMessage() {
      if (this.message.trim() && !this.isLoading) {
        if (!this.currentChat) {
          await this.createNewChat();
        }
        await this.addMessageToChat(this.message, "user");

        // Prepare the entire message history
        const messages = this.messages.map((msg) => ({
          role: msg.role,
          content: msg.text,
        }));

        this.isLoading = true;
        const settings = await db.settings.get(1);
        const apiKey = settings ? settings.apiKey : null;
        const url = settings ? settings.url + "/chat/completions" : "";
        const temperature = settings ? settings.temperature : 0.7;
        const systemPrompt = settings ? settings.systemPrompt : "";

        if (systemPrompt) {
          messages.unshift({ role: "system", content: systemPrompt });
        }

        const requestBody = {
          messages,
          temperature,
          max_tokens: -1,
          stream: false, // Set stream to false
        };

        const headers = {};

        if (apiKey) {
          headers["x-api-key"] = apiKey;
        }

        try {
          const response = await axios.post(url, requestBody, {
            headers,
          });

          if (response.status === 200) {
            const assistantMessage = response.data.choices[0].message.content;
            await this.addMessageToChat(assistantMessage, "system");
          } else {
            console.error("Error:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }

        this.isLoading = false;
        this.message = ""; // Clear the message input
        this.$refs.chatInput.style.height = "3rem"; // Reset height after sending the message
      }
    },
    async loadChatMessages(chat) {
      this.messages = await db.messages.where({ chatId: chat.id }).toArray();
      this.currentChat = chat; // Set the current chat
      this.scrollToBottom(); // Scroll to the bottom after loading messages
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
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    },
  },
  async mounted() {
    const settings = await db.settings.get(1);
    if (settings) {
      this.apiKey = settings.apiKey;
      this.url = settings.url;
      this.temperature = settings.temperature;
      this.systemPrompt = settings.systemPrompt;
    } else {
      console.log("Settings not found");
    }
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
  .chat-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column; /* Use column to stack messages from top to bottom */
    justify-content: flex-end; /* Ensure messages start from the bottom */
    background-color: $ResSmoke; /* Ensure the background color remains consistent */
    .chat-message-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-end; /* Align user messages to the right */
      &.system-message {
        align-items: flex-start; /* Align system messages to the left */
      }
    }
    .chat-message {
      margin-bottom: 1rem;
      .message-content {
        background-color: $ResBlack; /* Dark background for messages */
        border-radius: $ResRoundedEdges;
        border: 1px solid $ResPurple;
        padding: 0.5rem;
        font-family: $mainFont;
        color: $ResWhite; /* White text color */
        max-width: 100%; /* Set the width to 100% */
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
