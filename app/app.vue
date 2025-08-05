<script setup>
useFetch("/api/projects", {
  key: "projectData",
});
</script>

<template>
  <NuxtLayout> <NuxtPage /> </NuxtLayout>
</template>
