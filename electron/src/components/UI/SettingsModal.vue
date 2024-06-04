<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Settings</h2>
      <form @submit.prevent="saveSettings">
        <div class="form-group">
          <label for="apiKey">API Key</label>
          <input type="text" id="apiKey" v-model="apiKey" />
        </div>
        <div class="form-group">
          <label for="url">API URL</label>
          <input type="text" id="url" v-model="url" />
        </div>
        <div class="form-group">
          <label for="model">Model</label>
          <input type="text" id="model" v-model="model" />
        </div>
        <div class="form-group">
          <label for="temperature">Temperature</label>
          <input
            type="number"
            id="temperature"
            v-model="temperature"
            step="0.01"
          />
        </div>
        <div class="form-actions">
          <button type="button" @click="closeModal">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsModal",
  data() {
    return {
      apiKey: "",
      url: "",
      model: "",
      temperature: 0.7,
    };
  },
  methods: {
    saveSettings() {
      // Save settings to the database
      // Close modal after saving
      this.$emit("close");
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
