<script setup lang="ts">
import { newProject, newTask, remove } from "@/lib/data";
import { authClient } from "~/lib/auth-client";
const { data: projects } = useNuxtData("projectData");
const session = authClient.useSession();
</script>

<template v-else>
  <button @click="console.log(session.data?.user.id)">Click</button>
  <h1>My Data</h1>
  <ul class="text-center">
    <li v-for="project in projects" class="inline-block">
      <details class="flex m-3 bg-[#002FA7] border-white border-3 rounded-xl">
        <summary class="flex p-6">
          <div>
            <p>
              {{
                (project.tasks !== null ? project.tasks.length : 0) + " tasks"
              }}
            </p>
            <input :value="project.name" />
            <input :value="project.description" />
            <input :value="project.description" />
            <button
              @click="remove(project.id, 'project')"
              class="bg-red-500 rounded p-2"
            >
              <Icon name="material-symbols:delete-forever-outline-rounded" />
            </button>
          </div>
        </summary>
        <div class="bg-gray-800 p-4 rounded-xl border-3 border-black">
          <li v-for="task in project.tasks">
            <input :value="task.title" />
            <input :value="task.description" />
            <input :value="task.status" />
            <button
              @click="remove(task.id, 'task')"
              class="bg-red-500 rounded p-2"
            >
              <Icon name="material-symbols:delete-forever-outline-rounded" />
            </button>
          </li>
          <button @click="newTask(project.id)" class="bg-green-500 rounded p-2">
            Add Task
          </button>
        </div>
      </details>
    </li>
  </ul>
  <button @click="newProject" class="bg-green-500 rounded p-2">
    Add Project
  </button>
</template>

<style scoped>
input {
  border-radius: 10px;
  padding: 6px;
  background-color: #ff4f00;
  margin: 3px;
}

@media (max-width: 1500px) {
  ul {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
