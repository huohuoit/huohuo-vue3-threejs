<template>
  <div class="home">
    <h1>Vue3 + Three.js Demo</h1>
    <router-link to="/scene" class="scene-link">查看3D场景</router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.scene-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style> 