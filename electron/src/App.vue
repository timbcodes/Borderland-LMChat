<template>
  <div class="ui-wrapper">
    <div class="router-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>
<style lang="scss" scoped>
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";
.ui-wrapper {
  width: 100%;
  height: 100vh;
  .router-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
