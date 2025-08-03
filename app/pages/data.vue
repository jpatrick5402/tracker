<script setup>
const response = await useFetch("/api/data");
const tasks = ref(response["data"]);
</script>

<template>
  <h1>My Data</h1>
  <ul>
    <li v-for="task in tasks">
      <input v-for="key in task" :value="key" />
    </li>
  </ul>
</template>

<style>
ul {
  list-style-type: none;
  padding: 0px;
}
</style>
