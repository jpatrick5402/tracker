<script setup>
const { data: projects } = useNuxtData("projectData");

async function newProject() {
  try {
    await $fetch("/api/newProject");
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
}

async function newTask() {
  try {
    await $fetch("/api/newTask");
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
}
</script>

<template v-else>
  <h1>My Data</h1>
  <ul>
    <li v-for="project in projects">
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
        <button @click="newTask">Add Task</button>
      </details>
    </li>
    <button @click="newProject">Add Project</button>
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
