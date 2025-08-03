<script setup>
const data = (await useFetch("/api/data"))["data"];
</script>

<template>
  <h1>My Data</h1>
  <ul>
    <li v-for="project in data">
      <details>
        <summary>
          <input :value="project.name" />
          <input :value="project.description" />
        </summary>
        <li v-for="task in project.tasks">
          <input :value="task.name" />
          <input :value="task.description" />
          <input :value="task.status" />
        </li>
        <button>Add Task</button>
      </details>
    </li>
    <button>Add Project</button>
  </ul>
  <button>Save</button>
</template>

<style>
details li,
details button {
  margin-left: 30px;
}

ul {
  list-style-type: none;
  padding: 0px;
}
</style>
