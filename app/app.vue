<script setup>
const isLoggedIn = ref(false);
const links = [
  { name: "Home", path: "/" },
  { name: "Tasks", path: "/tasks" },
  { name: "Projects", path: "/projects" },
];
</script>

<template>
  <span class="row">
    <nav>
      <button v-if="!isLoggedIn" @click="isLoggedIn = !isLoggedIn">
        Sign In
      </button>
      <ul>
        <li v-for="link in links">
          <NuxtLink :to="link.path">{{ link.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <main>
      <NuxtPage />
    </main>
  </span>
  <footer>
    <p>&copy 2025 Joseph Patrick</p>
  </footer>
</template>

<style>
html {
  background-color: rgb(182, 182, 182);
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
  background-color: bisque;
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
</style>
