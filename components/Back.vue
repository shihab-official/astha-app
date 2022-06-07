<template>
  <NuxtLink :to="to" :class="`${classList} back mr-2 text-gray-500 text-sm inline-flex justify-center items-center w-6 h-6 border border-solid rounded-full`" title="Back">
    <a-icon type="arrow-left" class="text-sm" />
  </NuxtLink>
</template>

<style scoped>
  .back:hover {
    color: #fff;
    background-color: #b175e7;
    border-color: #b175e7;
  }
</style>

<script>
  export default {
    props: ['to', 'classList'],
  }
</script>
