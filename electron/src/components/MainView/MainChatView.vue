<template>
  <div class="chat-app">
    <div v-if="!currentChat && messages.length === 0" class="no-chat-view">
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
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="chat-message-wrapper"
      >
        <div
          :class="[
            'chat-message',
            msg.role === 'user' ? 'user-message' : 'system-message',
          ]"
        >
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
import { parseMarkdown } from "@/js/utils/markdown.utils";
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
    async addMessageToChat(text, role = "user") {
      const newMessage = {
        chatId: this.currentChat.id,
        text,
        role,
        createdAt: new Date(),
      };
      console.log("Saving message:", newMessage);
      await db.messages.add(newMessage);
      this.messages.unshift(newMessage); // Add new message at the beginning
    },
    async sendMessage() {
      if (this.message.trim() && !this.isLoading) {
        if (!this.currentChat) {
          await this.createNewChat();
        }
        await this.addMessageToChat(this.message);
        // Scroll to the bottom of the chat messages
        this.$nextTick(() => {
          const chatMessages = this.$refs.chatMessages;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        this.isLoading = true;
        const settings = await db.settings.get(1);
        const apiKey = settings ? settings.apiKey : null;
        const url = settings ? settings.url + "/chat/completions" : "";
        const temperature = settings ? settings.temperature : 0.7;
        const systemPrompt = settings ? settings.systemPrompt : "";

        const userMessage = this.message.trim(); // Store the user's message in a separate variable
        const messages = [{ role: "user", content: userMessage }];
        if (systemPrompt) {
          messages.unshift({ role: "system", content: systemPrompt });
        }
        console.log("Sending messages:", messages); // Debugging statement

        // Clear the message input after storing the user's message
        this.message = "";
        this.$refs.chatInput.style.height = "3rem"; // Reset height after sending the message

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
      }
    },
    async streamResponse(stream) {
      const textDecoder = new TextDecoder("utf-8");
      let messageText = "";

      const reader = stream.getReader();
      let { value, done } = await reader.read();

      while (!done) {
        const chunk = textDecoder.decode(value);
        messageText += chunk;

        // Update the chat message in real-time
        this.messages[this.messages.length - 1].text =
          parseMarkdown(messageText);

        ({ value, done } = await reader.read());
      }
    },
    async loadChatMessages(chat) {
      console.log(`Loading messages for chatId: ${chat.id}`); // Debugging statement
      this.messages = await db.messages.where({ chatId: chat.id }).toArray();
      this.messages.reverse(); // Reverse to show latest messages at the bottom
      console.log("Loaded messages:", this.messages); // Debugging statement
      this.currentChat = chat; // Set the current chat
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
    const settings = await db.settings.get(1);
    if (settings) {
      this.apiKey = settings.apiKey;
      this.url = settings.url;
      this.temperature = settings.temperature;
      this.systemPrompt = settings.systemPrompt;
    } else {
      console.log("Settings not found");
      // Handle the case when settings are not found, e.g., show an error message or set default values
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
    .chat-message-wrapper {
      display: flex;
      flex-direction: column;
    }
    .chat-message {
      margin-bottom: 1rem;
      display: flex;
      justify-content: flex-end; /* Align user messages to the right */
      .message-content {
        background-color: $ResBlack; /* Dark background for messages */
        border-radius: $ResRoundedEdges;
        border: 1px solid $ResPurple;
        padding: 0.5rem;
        font-family: $mainFont;
        color: $ResWhite; /* White text color */
        max-width: 40%; /* Reduce the width of the message bubbles */
      }
      &.system-message {
        justify-content: flex-start; /* Align system messages to the left */
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
