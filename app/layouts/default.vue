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
  <span class="row">
    <nav class="p-5">
      <img
        v-if="session?.data"
        :src="session?.data?.user?.image || ''"
        alt="Profile Picture"
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
        @click="() => authClient.signOut()"
        class="bg-[#002FA7] p-2 rounded-xl"
      >
        Sign Out
      </button>
      <ul>
        <li v-for="link in links">
          <NuxtLink :to="link.path">{{ link.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <main>
      <slot />
    </main>
  </span>
  <footer>
    <p>&copy 2025 Joseph Patrick</p>
  </footer>
</template>

<style>
html {
  background-color: rgb(136, 136, 136);
}

body {
  margin: 0px;
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
.row {
  display: flex;
  flex-direction: row;
  flex: 1;
}

nav {
  background-color: rgb(141, 117, 88);
  display: flex;
  flex-direction: column;
  width: 10%;
  align-items: center;
  gap: 10px;
  padding: 6px;
}

nav ul {
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  gap: 10px;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

footer {
  background-color: rgb(0, 82, 54);
  display: flex;
  flex-direction: row;
  justify-content: center;
}

@media (max-width: 700px) {
  .row {
    flex-direction: column;
  }

  nav {
    width: 100%;
  }

  nav ul {
    flex-direction: row;
  }
}
</style>
