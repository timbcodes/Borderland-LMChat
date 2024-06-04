<template>
  <div class="tooltip" v-if="visible" :style="position">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "ToolTip",
  data() {
    return {
      visible: false,
      text: "",
      position: { top: "0px", left: "0px" },
      timeout: null,
    };
  },
  methods: {
    show(text, event) {
      this.text = text;
      const rect = event.target.getBoundingClientRect();
      const topBarRect = event.target
        .closest(".topbar-main-container")
        .getBoundingClientRect();
      this.position = {
        top: `${rect.bottom + window.scrollY + 10}px`,
        left: `${rect.left - topBarRect.left}px`,
      };
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    delayShow(text, event) {
      this.timeout = setTimeout(() => this.show(text, event), 1000);
    },
    cancelShow() {
      clearTimeout(this.timeout);
      this.hide();
    },
  },
};
</script>

<style scoped>
.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 0.75rem;
  z-index: 1000;
  white-space: nowrap;
}
</style>
