<script setup>
const response = await useFetch("/api/data");
const tasks = response["data"];
</script>

<template>
  <h1>My Data</h1>
  <ul>
    <li v-for="task in tasks">{{ task }}</li>
  </ul>
</template>
