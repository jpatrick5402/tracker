<script setup lang="ts">
const links = [{ name: "Home", path: "/" }];
import { authClient } from "~/lib/auth-client";
const session = authClient.useSession();
</script>

<template>
  <NuxtLoadingIndicator />
  <span class="row flex flex-row flex-1">
    <nav
      class="p-5 gap-2 align-center width-[10%] flex-col flex bg-black border-r-2 border-cyan-400 shadow-[2px_0_10px_rgba(0,255,255,0.3)]"
    >
      <img
        width="150px"
        v-if="session?.data"
        :src="session?.data?.user?.image || ''"
        alt="Profile Picture"
        class="rounded-[50%] border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.6)]"
      />
      <div v-if="!session?.data" class="flex flex-col login-links">
        <button
          @click="
            () =>
              authClient.signIn.social({
                provider: 'google',
                callbackURL: '/',
              })
          "
          class="bg-black border border-cyan-400 text-cyan-400 p-3 rounded-md hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.8)]"
        >
          Sign In with Google
        </button>
        <button
          @click="
            () =>
              authClient.signIn.social({
                provider: 'github',
                callbackURL: '/',
              })
          "
          class="bg-black border border-cyan-400 text-cyan-400 p-3 rounded-md hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.8)]"
        >
          Sign In with GitHub
        </button>
      </div>
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
        class="bg-black border border-red-500 text-red-500 p-3 rounded-md hover:bg-red-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,0,0,0.8)]"
      >
        Sign Out
      </button>
      <ul class="text-center flex flex-col gap-2">
        <li v-for="link in links">
          <NuxtLink :to="link.path">{{ link.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <main
      class="flex flex-col w-full p-6 text-center bg-gradient-to-br from-gray-900 to-black text-cyan-400"
    >
      <slot />
    </main>
  </span>
  <footer
    class="flex flex-row justify-center p-4 bg-black border-t-2 border-cyan-400 shadow-[0_-2px_10px_rgba(0,255,255,0.3)] text-cyan-400"
  >
    <p>&copy 2025 Joseph Patrick</p>
  </footer>
  <ToastContainer />
</template>

<style>
html {
  background: linear-gradient(135deg, #000000 0%, #001122 50%, #000011 100%);
  font-family: "Courier New", monospace;
}

#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Tron-inspired navigation links */
nav a {
  color: #00ffff;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;
}

nav a:hover {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

@media (prefers-color-scheme: dark) {
  html {
    background: linear-gradient(135deg, #000000 0%, #001122 50%, #000011 100%);
    color: #00ffff;
  }
}
</style>

<style scoped>
@media (max-width: 900px) {
  .row {
    flex-direction: column;
  }

  .login-links {
    flex-direction: row;
  }

  nav {
    width: 100%;
    flex-direction: row;
    justify-content: center;
		border-bottom: 8px solid;
		border-right: 0px;
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
