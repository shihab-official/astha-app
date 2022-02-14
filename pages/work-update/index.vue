<template>
  <div>
    <div class="header flex justify-between">
      <h1 class="m-0">Work log</h1>
      <NuxtLink to="/work-update/log" class="py-1 px-4 bg-sky-500 text-white hover:bg-sky-600 hover:text-white rounded">Log</NuxtLink>
    </div>
    <hr>
    Work log...
  </div>
</template>

<script>
export default {
  name: 'Work-Update',
  mounted: () => {
    document.title = 'Work Update';
  },
};
</script>
