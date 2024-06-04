<template>
  <div class="chat-app">
    <div class="chat-messages" ref="chatMessages">
      <!-- Messages will be dynamically rendered here -->
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
export default {
  name: "ChatApp",
  data() {
    return {
      message: "",
      maxHeight: 150, // Maximum height for the text area
    };
  },
  methods: {
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
    sendMessage() {
      if (this.message.trim()) {
        // Handle message submission logic here
        this.message = "";
        this.$refs.chatInput.style.height = "3rem"; // Reset height after sending the message
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/scss/variables.scss"; // Import your variables
@import "@/scss/mixins.scss"; // Import your mixins
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
    background-color: $ResGrey;
  }
  .chat-input-container {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    background-color: $ResGrey;
    position: relative;
    .chat-input-wrapper {
      position: relative;
      display: flex;
      align-items: flex-end; /* Align items to the bottom */
      width: 100%;
      max-width: 600px;
    }
    .chat-input {
      flex: 1;
      padding: 0.5rem 2.5rem 0.5rem 0.5rem;
      border: 1px solid $ResBorder;
      border-radius: $ResRoundedEdges;
      resize: none; /* Prevent manual resizing */
      overflow: hidden; /* Hide the scrollbar */
      max-height: 150px; /* Ensure scrolling after max-height */
      background-color: $ResLighterGrey;
      color: $ResWhite;
      font-family: $mainFont; /* Use the standard font */
      height: 3rem; /* Initial height */
      transition: height 0.2s; /* Smooth transition for height change */
      &:focus {
        outline: none;
        border-color: $ResPurple;
      }
      &::placeholder {
        color: $ResWhite;
        text-align: start; /* Align placeholder text to flex-start */
        vertical-align: middle; /* Center vertically */
      }
    }
    .chat-submit-button {
      position: absolute;
      right: 0.5rem; /* Position inside the chat input */
      bottom: 0.5rem; /* Align to the bottom */
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
        font-size: 0.875rem; /* Adjust the icon size */
      }
      &:hover {
        background-color: $ResDarkPurple;
      }
    }
  }
}
</style>
