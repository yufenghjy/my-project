<script setup>
</script>

<template>
  <div :class="origin">
    <div :class="container">
      <router-view />
    </div>
  </div>

</template>

<style scoped>
.origin {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../assets/background.jpg') no-repeat center center fixed;
  background-size: cover;
}
.container {
  width: 80%;
}
</style>