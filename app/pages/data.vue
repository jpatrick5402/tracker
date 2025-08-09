<script setup lang="ts">
import { newProject, newTask, remove } from "@/lib/data";
const { data } = useNuxtData("projectData");
</script>

<template v-else>
  <h1 class="text-3xl">My Data</h1>
  <div class="flex flex-row row">
    <ul class="text-center gap-2 flex flex-col mr-1">
      <p>Projects: {{ data.projects.length }}</p>
      <li v-for="project in data.projects">
        <details
          class="flex flex-col bg-[#002FA7] border-white border-3 rounded-xl"
        >
          <summary class="block p-6">
            <div class="flex flex-col">
              <p>
                {{
                  (project.tasks !== null ? project.tasks.length : 0) + " tasks"
                }}
              </p>
              <div class="flex m-auto">
                <input :value="project.name" placeholder="Project Name" />
                <input
                  :value="project.description"
                  placeholder="Project Description"
                />
                <button
                  @click="remove(project.id, 'project')"
                  class="bg-red-500 rounded p-2 align-center m-auto"
                >
                  <Icon
                    name="material-symbols:delete-forever-outline-rounded"
                  />
                </button>
              </div>
            </div>
          </summary>
          <div class="bg-gray-800 p-4 rounded-xl border-3 border-black">
            <li v-for="task in project.tasks">
              <div class="flex">
                <input :value="task.title" placeholder="Task Title" />
                <input
                  :value="task.description"
                  placeholder="Task Description"
                />
                <input :value="task.status" placeholder="Task Status" />
                <button
                  @click="remove(task.id, 'task')"
                  class="bg-red-500 rounded p-2 align-center m-auto"
                >
                  <Icon
                    name="material-symbols:delete-forever-outline-rounded"
                  />
                </button>
              </div>
            </li>
            <button
              @click="newTask(project.id)"
              class="bg-green-500 rounded p-2"
            >
              Add Task
            </button>
          </div>
        </details>
      </li>
      <button @click="newProject" class="bg-green-500 rounded p-2">
        Add Project
      </button>
    </ul>
    <ul class="text-center flex flex-col gap-2 ml-1">
      <p>Orphaned Tasks: {{ data.tasks.length }}</p>
      <div
        v-if="data.tasks.length > 0"
        class="bg-gray-800 p-4 rounded-xl border-3 border-black"
      >
        <li v-for="task in data.tasks">
          <div class="flex">
            <input :value="task.title" placeholder="Task Title" />
            <input :value="task.description" placeholder="Task Description" />
            <input :value="task.status" placeholder="Task Status" />
            <button
              @click="remove(task.id, 'task')"
              class="bg-red-500 rounded p-2 align-center m-auto"
            >
              <Icon name="material-symbols:delete-forever-outline-rounded" />
            </button>
          </div>
        </li>
      </div>
      <button @click="newTask()" class="bg-green-500 rounded p-2">
        Add Task
      </button>
    </ul>
  </div>
</template>

<style scoped>
input {
  border-radius: 10px;
  padding: 6px;
  background-color: #ff4f00;
  margin: 3px;
}

@media (max-width: 1560px) {
  ul {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .row {
    flex-direction: column;
  }
}
</style>
