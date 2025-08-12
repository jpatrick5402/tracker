<script setup lang="ts">
import { authClient } from "./lib/auth-client";

const { data: session } = await authClient.useSession(useFetch);

useFetch("/api/projects", {
  method: "POST",
  key: "projectData",
  body: JSON.stringify({
    user_id: session?.value?.user.id,
    project_sort: "created_at",
    project_task_sort: "created_at",
    orphan_task_sort: "created_at",
    project_sort_dir: "ASC",
    project_task_sort_dir: "ASC",
    orphan_task_sort_dir: "ASC",
  }),
});
</script>

<template>
  <NuxtLayout> <NuxtPage /> </NuxtLayout>
</template>

<style>
@import "tailwindcss";

:root {
 background-color: black;
}

html {
 background-color: black;
}
</style>
