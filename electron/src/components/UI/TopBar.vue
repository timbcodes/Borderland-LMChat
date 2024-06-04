<template>
  <div class="topbar-main-container">
    <div class="left-buttons-container">
      <i class="bi bi-chevron-left"></i>
      <i class="bi bi-plus-circle"></i>
    </div>
    <div class="middle-title-container">
      <!-- Title of chat will go here -->
    </div>
    <div class="right-logo-container">
      <img src="../../assets/borderland-logo.png" alt="logo" />
    </div>
  </div>
</template>
<script>
export default {
  name: "TopBar",
};
</script>
<style lang="scss" scoped>
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";
.topbar-main-container {
  @include flex(row, space-between, center);
  padding: 0 1rem;
  height: 3rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid $ResBorder;
  .left-buttons-container {
    display: flex;
    align-items: center;
    i {
      margin-right: 1rem;
      cursor: pointer;
      color: $ResPurple;
    }
  }
  .right-logo-container {
    img {
      height: 1.5rem;
    }
  }
}
</style>
