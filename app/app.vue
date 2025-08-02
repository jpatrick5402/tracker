<script setup>
const isLoggedIn = ref(false);
const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
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
  flex-grow: 1;
}

nav {
  padding: 10px;
}

nav ul {
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
}

main {
  display: flex;
  flex-direction: column;
  margin: auto;
}

footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
