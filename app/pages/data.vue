<script setup>
const {
  data: projects,
  refresh,
  pending,
} = useAsyncData("myProjects", () => $fetch("/api/projects"));

const newProject = () => {
  useFetch("/api/newProject");
  refresh("myProjects");
};

const newTask = () => {
  useFetch("/api/newTask");
  refresh("myProjects");
};
</script>
<template>
  <p v-if="pending">Loading...</p>
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
