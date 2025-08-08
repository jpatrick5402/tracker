<script setup lang="ts">
import { authClient } from "./lib/auth-client";

const { data: session } = await authClient.useSession(useFetch);

useFetch("/api/projects", {
  method: "POST",
  key: "projectData",
  body: JSON.stringify({ user_id: session?.value?.user.id }),
});
</script>

<template>
  <NuxtLayout> <NuxtPage /> </NuxtLayout>
</template>

<style>
@import "tailwindcss";
</style>
