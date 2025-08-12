import { useDebounceFn } from "@vueuse/core";
import { authClient } from "./auth-client";

// Function to refresh data with current sorting settings
async function refreshDataWithCurrentSorting() {
  const session = authClient.useSession();
  
  // Check if user is authenticated
  if (!session.value.data?.user) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  // Get current sorting settings from the page state if available
  // These will be the reactive refs from the index.vue page
  const projectSort = useState('projectSort', () => 'created_at');
  const projectTaskSort = useState('projectTaskSort', () => 'created_at');
  const orphanTaskSort = useState('orphanTaskSort', () => 'created_at');
  const projectSortDir = useState('projectSortDir', () => 'ASC');
  const projectTaskSortDir = useState('projectTaskSortDir', () => 'ASC');
  const orphanTaskSortDir = useState('orphanTaskSortDir', () => 'ASC');

  try {
    const newData = await $fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        user_id: session.value.data?.user.id,
        project_sort: projectSort.value,
        project_task_sort: projectTaskSort.value,
        orphan_task_sort: orphanTaskSort.value,
        project_sort_dir: projectSortDir.value,
        project_task_sort_dir: projectTaskSortDir.value,
        orphan_task_sort_dir: orphanTaskSortDir.value,
      }),
    });

    // Update the cached data directly
    const nuxtData = useNuxtData("projectData");
    nuxtData.data.value = newData;
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }
    console.error("Failed to refresh data with sorting:", error);
    throw error;
  }
}

export async function newProject() {
  const { start, finish } = useLoadingIndicator();
  const session = authClient.useSession();

  // Check if user is authenticated
  if (!session.value.data?.user) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  start();
  try {
    await $fetch("/api/newProject", {
      method: "POST",
      body: JSON.stringify({
        user_id: session.value.data?.user.id,
      }),
    });
    // Use the sorting-aware refresh instead of basic refresh
    await refreshDataWithCurrentSorting();
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }
    console.log(error);
    throw error;
  }
  finish();
}

export async function newTask(id?: string) {
  const { start, finish } = useLoadingIndicator();
  const session = authClient.useSession();

  // Check if user is authenticated
  if (!session.value.data?.user) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  start();
  try {
    await $fetch("/api/newTask", {
      method: "POST",
      body: JSON.stringify({
        project_id: id,
        user_id: session.value.data?.user.id,
      }),
    });
    // Use the sorting-aware refresh instead of basic refresh
    await refreshDataWithCurrentSorting();
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }
    console.log(error);
    throw error;
  }
  finish();
}

export async function remove(objectId: number, objectType: string) {
  const { start, finish } = useLoadingIndicator();
  start();
  try {
    await $fetch("/api/remove", {
      method: "POST",
      body: JSON.stringify({ type: objectType, id: objectId }),
    });
    // Use the sorting-aware refresh instead of basic refresh
    await refreshDataWithCurrentSorting();
  } catch (error) {
    console.log(error);
  }
  finish();
}

export async function moveTask(
  taskId: number,
  fromProjectId?: string,
  toProjectId?: string
) {
  const { start, finish } = useLoadingIndicator();
  start();
  try {
    await $fetch("/api/moveTask", {
      method: "POST",
      body: JSON.stringify({
        task_id: taskId,
        from_project_id: fromProjectId,
        to_project_id: toProjectId,
      }),
    });
    // Use the sorting-aware refresh instead of basic refresh
    await refreshDataWithCurrentSorting();
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }
    console.log(error);
    throw error;
  }
  finish();
}

const _saveFn = async (
  type: string,
  id: string,
  field: string,
  value: string
) => {
  const { start, finish } = useLoadingIndicator();
  start();
  try {
    await $fetch("/api/save", {
      method: "POST",
      body: JSON.stringify({ type, id, field, value }),
    });
    
    // If the field being updated is related to sorting, refresh with current sorting
    // This ensures changes like name, status, etc. immediately reflect in the sorted list
    if (['name', 'title', 'status', 'description'].includes(field)) {
      await refreshDataWithCurrentSorting();
    }
  } catch (error) {
    console.log(error);
  }
  finish();
};

export const save = useDebounceFn(_saveFn, 2000);
export const saveImmediately = _saveFn;

// Export the refreshDataWithCurrentSorting function for use elsewhere
export { refreshDataWithCurrentSorting };
