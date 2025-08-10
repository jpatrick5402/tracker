<script setup lang="ts">
const links = [
  { name: "Home", path: "/" },
  { name: "Data", path: "/data" },
];
import { authClient } from "~/lib/auth-client";
const session = authClient.useSession();
</script>

<template>
  <NuxtLoadingIndicator />
  <span class="row flex flex-row flex-1">
    <nav class="p-5 gap-2 align-center width-[10%] flex-col flex bg-[#8d8258]">
      <img
        width="150px"
        v-if="session?.data"
        :src="session?.data?.user?.image || ''"
        alt="Profile Picture"
        class="rounded-[50%] border-2 border-(--foreground)"
      />
      <button
        v-if="!session?.data"
        @click="
          () =>
            authClient.signIn.social({
              provider: 'github',
              callbackURL: '/data',
            })
        "
        class="bg-[#002FA7] p-2 rounded-xl"
      >
        Sign In with GitHub
      </button>
      <button
        v-else
        @click="
          () =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  return navigateTo('/') as Promise<void>;
                },
              },
            })
        "
        class="bg-[#002FA7] p-2 rounded-xl"
      >
        Sign Out
      </button>
      <ul class="text-center flex flex-col gap-2">
        <li v-for="link in links">
          <NuxtLink :to="link.path">{{ link.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <main class="flex flex-col w-full p-2 text-center">
      <slot />
    </main>
  </span>
  <footer class="flex flex-row justify-center p-2 bg-[#005236]">
    <p>&copy 2025 Joseph Patrick</p>
  </footer>
</template>

<style>
html {
  background-color: rgb(136, 136, 136);
}

#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  html {
    background-color: rgb(36, 36, 36);
    color: white;
  }
}
</style>

<style scoped>
@media (max-width: 700px) {
  .row {
    flex-direction: column;
  }

  nav {
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }

  nav img {
    max-height: 75px;
    max-width: 75px;
  }

  nav ul {
    flex-direction: row;
    margin-top: auto;
    margin-bottom: auto;
  }
}
</style>
