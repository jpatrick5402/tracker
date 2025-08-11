<script setup lang="ts">
import { newProject, newTask, remove, save } from "@/lib/data";
const { data } = useNuxtData("projectData");
</script>

<template v-else>
  <h1 class="text-4xl font-mono text-cyan-400 mb-8 tracking-wider shadow-[0_0_20px_rgba(0,255,255,0.4)]">MY DATA</h1>
  <div class="flex flex-row row gap-2">
    <ul class="text-center gap-2 flex flex-col w-full">
      <p class="text-xl font-mono text-blue-400 mb-4 tracking-wider shadow-[0_0_10px_rgba(0,100,255,0.4)]">PROJECTS: {{ data.projects.length }}</p>
      <li v-for="project in data.projects">
        <details
          class="flex flex-col bg-black border-2 border-blue-500 rounded-lg shadow-[0_0_20px_rgba(0,100,255,0.4)] hover:shadow-[0_0_30px_rgba(0,100,255,0.6)] transition-all duration-300 mb-4"
        >
          <summary class="block p-6 cursor-pointer text-blue-400 font-mono hover:text-white hover:bg-blue-900/20 rounded-t-lg transition-all duration-300">
            <div class="flex flex-col">
              <div class="flex items-center justify-center mb-2">
                <span class="dropdown-arrow mr-2">▶</span>
                <p>
                  {{
                    (project.tasks !== null ? project.tasks.length : 0) + " tasks"
                  }}
                </p>
              </div>
              <div class="flex m-auto">
                <input
                  v-model="project.name"
                  @input="save('project', project.id, 'name', project.name)"
                  placeholder="Project Name"
                />
                <input
                  v-model="project.description"
                  @input="
                    save(
                      'project',
                      project.id,
                      'description',
                      project.description
                    )
                  "
                  placeholder="Project Description"
                />
                <button
                  @click="remove(project.id, 'project')"
                  class="tron-button tron-button-red"
                >
                  <Icon
                    name="material-symbols:delete-forever-outline-rounded"
                  />
                </button>
              </div>
            </div>
          </summary>
          <div class="bg-black border-2 border-blue-500 p-4 rounded-lg shadow-[0_0_15px_rgba(0,100,255,0.3)] mt-2">
            <li v-for="task in project.tasks">
              <div class="flex">
                <input
                  v-model="task.title"
                  @input="save('task', task.id, 'title', task.title)"
                  placeholder="Task Title"
                  class="project-task-input"
                />
                <input
                  v-model="task.description"
                  @input="
                    save('task', task.id, 'description', task.description)
                  "
                  placeholder="Task Description"
                  class="project-task-input"
                />
                <input
                  v-model="task.status"
                  @input="save('task', task.id, 'status', task.status)"
                  placeholder="Task Status"
                  class="project-task-input"
                />
                <button
                  @click="remove(task.id, 'task')"
                  class="tron-button tron-button-red"
                >
                  <Icon
                    name="material-symbols:delete-forever-outline-rounded"
                  />
                </button>
              </div>
            </li>
            <button
              @click="newTask(project.id)"
              class="tron-button tron-button-blue mt-4"
            >
              Add Task
            </button>
          </div>
        </details>
      </li>
      <button @click="newProject" class="tron-button tron-button-blue mt-4">
        Add Project
      </button>
    </ul>
    <ul class="text-center flex flex-col gap-2 w-full">
      <p class="text-xl font-mono text-red-500 mb-4 tracking-wider shadow-[0_0_10px_rgba(255,0,0,0.4)]">ORPHAN TASKS: {{ data.tasks.length }}</p>
      <div
        v-if="data.tasks.length > 0"
        class="bg-black border-2 border-red-500 p-4 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] transition-all duration-300 mb-4"
      >
        <li v-for="task in data.tasks">
          <div class="flex">
            <input
              v-model="task.title"
              @input="save('task', task.id, 'title', task.title)"
              placeholder="Task Title"
              class="task-input"
            />
            <input
              v-model="task.description"
              @input="save('task', task.id, 'description', task.description)"
              placeholder="Task Description"
              class="task-input"
            />
            <input
              v-model="task.status"
              @input="save('task', task.id, 'status', task.status)"
              placeholder="Task Status"
              class="task-input"
            />
            <button
              @click="remove(task.id, 'task')"
              class="tron-button tron-button-red"
            >
              <Icon name="material-symbols:delete-forever-outline-rounded" />
            </button>
          </div>
        </li>
      </div>
      <button @click="newTask()" class="tron-button tron-button-red mt-4">
        Add Task
      </button>
    </ul>
  </div>
</template>

<style scoped>
/* Tron-inspired input styling */
input {
  background: transparent;
  border: 1px solid #00ffff;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 4px;
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
  transition: all 0.3s ease;
}

input::placeholder {
  color: rgba(0, 255, 255, 0.5);
}

input:focus {
  outline: none;
  border-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  color: #ffffff;
}

/* Light blue inputs for project task fields */
.project-task-input {
  border-color: #00ffff;
  color: #00ffff;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
}

.project-task-input::placeholder {
  color: rgba(0, 255, 255, 0.5);
}

.project-task-input:focus {
  border-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  color: #ffffff;
}

/* Light blue inputs for orphan task fields */
.task-input {
  border-color: #00ffff;
  color: #00ffff;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
}

.task-input::placeholder {
  color: rgba(0, 255, 255, 0.5);
}

.task-input:focus {
  border-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  color: #ffffff;
}

/* Dropdown arrow animation */
.dropdown-arrow {
  transition: transform 0.3s ease;
  color: #0064ff;
  font-size: 16px;
}

details[open] .dropdown-arrow {
  transform: rotate(90deg);
}

/* Button styling */
.tron-button {
  background: transparent;
  border: 2px solid;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tron-button-blue {
  border-color: #0064ff;
  color: #0064ff;
  box-shadow: 0 0 10px rgba(0, 100, 255, 0.3);
}

.tron-button-blue:hover {
  background: #0064ff;
  color: black;
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.6);
}

.tron-button-red {
  border-color: #ff0040;
  color: #ff0040;
  box-shadow: 0 0 10px rgba(255, 0, 64, 0.3);
}

.tron-button-red:hover {
  background: #ff0040;
  color: black;
  box-shadow: 0 0 20px rgba(255, 0, 64, 0.6);
}

.tron-button-green {
  border-color: #00ff80;
  color: #00ff80;
  box-shadow: 0 0 10px rgba(0, 255, 128, 0.3);
}

.tron-button-green:hover {
  background: #00ff80;
  color: black;
  box-shadow: 0 0 20px rgba(0, 255, 128, 0.6);
}

@media (max-width: 1560px) {
  ul {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .row {
    flex-direction: column;
    gap: 40px;
  }
}
</style>
