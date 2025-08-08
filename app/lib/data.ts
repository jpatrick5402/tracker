import { authClient } from "./auth-client";

export async function newProject() {
  const { start, finish } = useLoadingIndicator();
  const session = authClient.useSession();
  start();
  try {
    await $fetch("/api/newProject", {
      method: "POST",
      body: JSON.stringify({ user_id: session.value.data?.user.id }),
    });
    await refreshNuxtData("projectData");
  } catch (error) {
    console.log(error);
  }
  finish();
}

export async function newTask(id: number) {
  const { start, finish } = useLoadingIndicator();
  const session = authClient.useSession();
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
  } catch (error) {
    console.log(error);
  }
  finish();
}

export async function remove(objectId: number, objectType: string) {
  const { start, finish } = useLoadingIndicator();
  const session = authClient.useSession();
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
