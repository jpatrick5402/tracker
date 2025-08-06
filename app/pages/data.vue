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
      <details class="flex m-3 bg-[#002FA7] border-white border-3 rounded-xl">
        <summary class="flex p-6 m-3">
          <div>
            <input :value="project.name" />
            <input :value="project.description" />
            <Icon
              name="material-symbols:delete-forever-outline-rounded"
              @click="remove(project.id, 'project')"
            />
          </div>
        </summary>
        <div class="m-3 bg-gray-800 p-4 rounded-xl border-3 border-black">
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
      </details>
    </li>
    <button @click="newProject">Add Project</button>
  </ul>
</template>

<style scoped>
input {
  border-radius: 10px;
  padding: 6px;
  background-color: #ff4f00;
  margin: 3px;
}

button {
  background-color: #002fa7;
  border-radius: 10px;
  padding: 6px;
  margin: 3px;
}
</style>
