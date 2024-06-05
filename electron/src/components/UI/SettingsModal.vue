<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Settings</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="apiKey">API Key (leave empty if blank)</label>
          <input type="text" id="apiKey" v-model="apiKey" />
        </div>
        <div class="form-group">
          <label for="url">URL</label>
          <input type="text" id="url" v-model="url" />
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
        <div class="form-group">
          <label for="systemPrompt"
            >System Prompt (leave blank to use default)</label
          >
          <textarea id="systemPrompt" v-model="systemPrompt"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-button" @click="closeModal">
            Cancel
          </button>
          <button type="submit" class="save-button">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Dexie from "dexie";

export default {
  name: "SettingsModal",
  data() {
    return {
      apiKey: "",
      url: "",
      model: "",
      temperature: 0.7,
      systemPrompt: "",
    };
  },
  async mounted() {
    const db = new Dexie("borderland-lmchat-settings");
    db.version(1).stores({ settings: "id" });
    const settings = await db.settings.get(1);
    if (settings) {
      this.apiKey = settings.apiKey;
      this.url = settings.url;
      this.model = settings.model;
      this.temperature = settings.temperature;
      this.systemPrompt = settings.systemPrompt;
    } else {
      this.saveSettings();
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async saveSettings() {
      const db = new Dexie("borderland-lmchat-settings");
      db.version(1).stores({ settings: "id" });
      const settings = {
        id: 1,
        apiKey: this.apiKey,
        url: this.url,
        model: this.model,
        temperature: this.temperature,
        systemPrompt: this.systemPrompt,
      };
      await db.settings.put(settings);
    },
    async handleSubmit() {
      await this.saveSettings();
      this.closeModal();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";

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
  background: $ResGrey;
  padding: 2rem;
  border-radius: $ResRoundedEdges;
  width: 400px;
  color: $ResWhite;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: $ResPurple;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: $ResWhite;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border-radius: $ResRoundedEdges;
    border: 1px solid $ResBorder;
    background-color: $ResLighterGrey;
    color: $ResWhite;

    &:focus {
      outline: none;
      border-color: $ResPurple;
    }
  }

  textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: $ResRoundedEdges;
    border: 1px solid $ResBorder;
    background-color: $ResLighterGrey;
    color: $ResWhite;
    resize: none;
    min-height: 100px;

    &:focus {
      outline: none;
      border-color: $ResPurple;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: $ResRoundedEdges;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .cancel-button {
    background-color: $ResLighterGrey;
    color: $ResWhite;
    border: 1px solid $ResBorder;

    &:hover {
      background-color: $ResGrey;
    }
  }

  .save-button {
    background-color: $ResPurple;
    color: $ResWhite;
    border: none;

    &:hover {
      background-color: $ResDarkPurple;
    }
  }
}
</style>
