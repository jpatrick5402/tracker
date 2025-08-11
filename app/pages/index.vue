<script setup lang="ts">
import {
  newProject,
  newTask,
  remove,
  save,
  saveImmediately,
  moveTask,
} from "@/lib/data";
const { data } = useNuxtData("projectData");
const { showAuthenticationError, showError } = useToast();

const statusOptions = ["To Do", "In Progress", "Done", "Blocked", "Backlog"];

// Drag and drop functionality
const draggedTask = ref<any>(null);
const draggedFromProject = ref<string | null>(null);

function handleDragStart(task: any, projectId?: string) {
  draggedTask.value = task;
  draggedFromProject.value = projectId || null;
}

function handleDragEnd() {
  draggedTask.value = null;
  draggedFromProject.value = null;
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  target.classList.add("drag-over");
}

function handleDragLeave(event: DragEvent) {
  const target = event.currentTarget as HTMLElement;
  target.classList.remove("drag-over");
}

async function handleDrop(event: DragEvent, targetProjectId?: string) {
  event.preventDefault();

  // Clean up drag-over class
  const target = event.currentTarget as HTMLElement;
  target.classList.remove("drag-over");

  if (!draggedTask.value) return;

  const taskId = draggedTask.value.id;
  const fromProjectId = draggedFromProject.value;
  const toProjectId = targetProjectId || null;

  // Don't move if dropping in the same location
  if (fromProjectId === toProjectId) return;

  try {
    await moveTask(taskId, fromProjectId!, toProjectId!);
  } catch (error: any) {
    if (error.message === "AUTHENTICATION_REQUIRED") {
      showAuthenticationError();
    } else {
      showError("Failed to move task. Please try again.");
      console.error("Failed to move task:", error);
    }
  }

  handleDragEnd();
}

// Error handling wrapper functions
async function handleNewProject() {
  try {
    await newProject();
  } catch (error: any) {
    if (error.message === "AUTHENTICATION_REQUIRED") {
      showAuthenticationError();
    } else {
      showError("Failed to create project. Please try again.");
      console.error("Failed to create project:", error);
    }
  }
}

async function handleNewTask(projectId?: string) {
  try {
    await newTask(projectId);
  } catch (error: any) {
    if (error.message === "AUTHENTICATION_REQUIRED") {
      showAuthenticationError();
    } else {
      showError("Failed to create task. Please try again.");
      console.error("Failed to create task:", error);
    }
  }
}
</script>

<template>
  <div class="flex flex-row row gap-2">
    <ul class="text-center gap-2 flex flex-col w-full">
      <p class="text-xl font-mono text-blue-400 mb-4 tracking-wider">
        PROJECTS: {{ data.projects.length }}
      </p>
      <li v-for="project in data.projects">
        <details
          class="flex flex-col bg-black border-2 border-blue-500 rounded-lg shadow-[0_0_20px_rgba(0,100,255,0.4)] hover:shadow-[0_0_30px_rgba(0,100,255,0.6)] transition-all duration-300 mb-4 drop-zone"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, project.id)"
        >
          <summary
            class="block p-6 cursor-pointer text-blue-400 font-mono hover:text-white hover:bg-blue-900/20 rounded-t-lg transition-all duration-300"
          >
            <div class="flex flex-col">
              <div class="flex items-center justify-center mb-2">
                <span class="dropdown-arrow mr-2">▶</span>
                <p>
                  {{
                    (project.tasks !== null ? project.tasks.length : 0) +
                    " tasks"
                  }}
                </p>
              </div>
              <div class="flex m-auto">
                <input
                  v-model="project.name"
                  @input="save('project', project.id, 'name', project.name)"
                  @blur="
                    saveImmediately('project', project.id, 'name', project.name)
                  "
                  placeholder="Project Name"
                  class="w-full"
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
                  @blur="
                    saveImmediately(
                      'project',
                      project.id,
                      'description',
                      project.description
                    )
                  "
                  placeholder="Project Description"
                  class="w-full"
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
          <div
            class="bg-black border-2 border-blue-500 p-4 rounded-lg shadow-[0_0_15px_rgba(0,100,255,0.3)] mt-2"
          >
            <li v-for="task in project.tasks">
              <div
                class="flex draggable-task"
                draggable="true"
                @dragstart="handleDragStart(task, project.id)"
                @dragend="handleDragEnd"
              >
                <div class="drag-handle">::</div>
                <input
                  v-model="task.title"
                  @input="save('task', task.id, 'title', task.title)"
                  @blur="saveImmediately('task', task.id, 'title', task.title)"
                  placeholder="Task Title"
                  class="project-task-input w-full"
                />
                <input
                  v-model="task.description"
                  @input="
                    save('task', task.id, 'description', task.description)
                  "
                  @blur="
                    saveImmediately(
                      'task',
                      task.id,
                      'description',
                      task.description
                    )
                  "
                  placeholder="Task Description"
                  class="project-task-input w-full"
                />
                <select
                  v-model="task.status"
                  @change="
                    saveImmediately('task', task.id, 'status', task.status)
                  "
                  class="project-task-input w-full"
                >
                  <option disabled value="">Select status</option>
                  <option
                    v-for="option in statusOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
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
              @click="handleNewTask(project.id)"
              class="tron-button tron-button-blue mt-4"
            >
              Add Task
            </button>
          </div>
        </details>
      </li>
      <button
        @click="handleNewProject"
        class="tron-button tron-button-blue mt-4"
      >
        Add Project
      </button>
    </ul>
    <ul class="text-center flex flex-col gap-2 w-full">
      <p class="text-xl font-mono text-red-500 mb-4 tracking-wider">
        ORPHAN TASKS: {{ data.tasks.length }}
      </p>
      <div
        class="bg-black border-2 border-red-500 p-4 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] transition-all duration-300 mb-4 drop-zone"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event)"
      >
        <div
          v-if="data.tasks.length === 0"
          class="text-red-400 text-center py-4 font-mono"
        >
          Drop tasks here to orphan them
        </div>
        <li v-for="task in data.tasks">
          <div
            class="flex draggable-task"
            draggable="true"
            @dragstart="handleDragStart(task)"
            @dragend="handleDragEnd"
          >
            <div class="drag-handle">::</div>
            <input
              v-model="task.title"
              @input="save('task', task.id, 'title', task.title)"
              @blur="saveImmediately('task', task.id, 'title', task.title)"
              placeholder="Task Title"
              class="task-input w-full"
            />
            <input
              v-model="task.description"
              @input="save('task', task.id, 'description', task.description)"
              @blur="
                saveImmediately(
                  'task',
                  task.id,
                  'description',
                  task.description
                )
              "
              placeholder="Task Description"
              class="task-input w-full"
            />
            <select
              v-model="task.status"
              @change="saveImmediately('task', task.id, 'status', task.status)"
              class="task-input w-full"
            >
              <option disabled value="">Select status</option>
              <option
                v-for="option in statusOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <button
              @click="remove(task.id, 'task')"
              class="tron-button tron-button-red"
            >
              <Icon name="material-symbols:delete-forever-outline-rounded" />
            </button>
          </div>
        </li>
      </div>
      <button @click="handleNewTask()" class="tron-button tron-button-red mt-4">
        Add Task
      </button>
    </ul>
  </div>
</template>

<style scoped>
/* Tron-inspired input and select styling */
input,
select {
  background: transparent;
  border: 1px solid #00ffff;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 4px;
  color: #00ffff;
  font-family: "Courier New", monospace;
  font-size: 14px;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
  transition: all 0.3s ease;
}

/* Select-specific styling */
select {
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}

select option {
  background-color: black;
  color: #00ffff;
  padding: 8px;
}

select option:hover {
  background-color: rgba(0, 255, 255, 0.1);
}

select option[disabled] {
  color: rgba(0, 255, 255, 0.5);
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
  font-family: "Courier New", monospace;
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

/* Drag and drop styles */
.draggable-task {
  cursor: grab;
  position: relative;
  transition: all 0.2s ease;
  border-radius: 4px;
  margin-bottom: 4px;
}

.draggable-task:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 255, 255, 0.2);
}

.draggable-task:active {
  cursor: grabbing;
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: auto;
  color: #666;
  font-family: "Courier New", monospace;
  font-weight: bold;
  cursor: grab;
  user-select: none;
  margin-right: 8px;
  transition: color 0.3s ease;
}

.draggable-task:hover .drag-handle {
  color: #00ffff;
}

.drop-zone {
  transition: all 0.3s ease;
  min-height: 60px;
}

.drop-zone.drag-over {
  border-color: #00ff80 !important;
  box-shadow: 0 0 30px rgba(0, 255, 128, 0.6) !important;
  transform: scale(1.02);
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
