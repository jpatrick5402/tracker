<script setup lang="ts">
useFetch("/api/projects", {
  key: "projectData",
});
</script>

<template>
  <NuxtLayout> <NuxtPage /> </NuxtLayout>
</template>

<style>
@import "tailwindcss";
</style>
