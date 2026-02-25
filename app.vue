<template>
  <UApp>

    <NuxtPage />
  </UApp>
</template>

<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap'
    }
  ]
})
</script>

<style>
:root {
  font-family: "Noto Sans Arabic", sans-serif;
}
</style>
