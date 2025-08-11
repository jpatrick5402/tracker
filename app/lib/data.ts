import { useDebounceFn } from "@vueuse/core";
import { authClient } from "./auth-client";

export async function newProject() {
  const { start, finish } = useLoadingIndicator();
  const session = authClient.useSession();
  
  // Check if user is authenticated
  if (!session.value.data?.user) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }
  
  start();
  try {
    await $fetch("/api/newProject", {
      method: "POST",
      body: JSON.stringify({
        user_id: session.value.data?.user.id,
      }),
    });
    await refreshNuxtData("projectData");
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw new Error('AUTHENTICATION_REQUIRED');
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
    throw new Error('AUTHENTICATION_REQUIRED');
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
    await refreshNuxtData("projectData");
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw new Error('AUTHENTICATION_REQUIRED');
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
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
  finish();
}

export async function moveTask(taskId: number, fromProjectId?: string, toProjectId?: string) {
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
    await refreshNuxtData("projectData");
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }
    console.log(error);
    throw error;
  }
  finish();
}

export const save = useDebounceFn(
  async (type: string, id: string, field: string, value: string) => {
    const { start, finish } = useLoadingIndicator();
    start();
    try {
      await $fetch("/api/save", {
        method: "POST",
        body: JSON.stringify({ type, id, field, value }),
      });
      await refreshNuxtData("projectData");
    } catch (error) {
      console.log(error);
    }
    finish();
  },
  2000
);
