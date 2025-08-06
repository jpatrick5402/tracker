<script setup lang="ts">
const { data: projects } = useNuxtData("projectData");
const { start, finish } = useLoadingIndicator();

async function newProject() {
  start();
  try {
    await $fetch("/api/newProject", {
      method: "POST",
    });
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
  finish();
}

async function newTask(id: number) {
  start();
  try {
    await $fetch("/api/newTask", {
      method: "POST",
      body: JSON.stringify({ project: id }),
    });
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
  finish();
}

async function remove(objectId: number, objectType: string) {
  start();
  try {
    await $fetch("/api/remove", {
      method: "POST",
      body: JSON.stringify({ type: objectType, id: objectId }),
    });
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
  finish();
}

const rotation = ref(270);
</script>

<template v-else>
  <h1>My Data</h1>
  <ul>
    <li v-for="project in projects">
      <div class="project">
        <Icon
          name="material-symbols:arrow-back-2"
          @click="rotation = rotation == 180 ? 270 : 180"
          :style="'rotate: ' + rotation + 'deg;'"
        />
        <input :value="project.name" />
        <input :value="project.description" />
        <Icon
          name="material-symbols:delete-forever-outline-rounded"
          @click="remove(project.id, 'project')"
        />
      </div>
      <div class="ml-10">
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
      </div>
    </li>
    <button @click="newProject">Add Project</button>
  </ul>
</template>

<style scoped>
input {
  border: 1px solid brown;
  border-radius: 10px;
  padding: 6px;
  background-color: #ff4f00;
  margin: 3px;
}

button {
  background-color: blue;
  border-radius: 10px;
  padding: 6px;
  margin: 3px;
}
</style>
