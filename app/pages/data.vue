<script setup>
const { data: projects } = useNuxtData("projectData");

async function newProject() {
  try {
    await $fetch("/api/newProject", {
      method: "POST",
    });
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
}

async function newTask(id) {
  try {
    await $fetch("/api/newTask", {
      method: "POST",
      body: JSON.stringify({ project: id }),
    });
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
}

async function remove(objectId, objectType) {
  try {
    await $fetch("/api/remove", {
      method: "POST",
      body: JSON.stringify({ type: objectType, id: objectId }),
    });
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
      <div class="horizontal">
        <details>
          <summary>
            <input :value="project.name" />
            <input :value="project.description" />
          </summary>
          <li v-for="task in project.tasks">
            <input :value="task.name" />
            <input :value="task.description" />
            <input :value="task.status" />
            <Icon
              name="material-symbols:delete-forever-outline-rounded"
              @click="remove(task.id, 'task')"
            />
          </li>
          <button @click="newTask(project.id)">Add Task</button>
        </details>
        <Icon
          name="material-symbols:delete-forever-outline-rounded"
          @click="remove(project.id, 'project')"
        />
      </div>
    </li>
    <button @click="newProject">Add Project</button>
  </ul>
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

.horizontal {
  display: flex;
}
</style>
