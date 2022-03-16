<template>
  <div>
    <div class="flex items-baseline">
      <h3 class="m-0">Apply for Leave</h3>
      <NuxtLink to="/" class="ml-5 text-gray-400 text-sm">
        <a-icon type="double-left" class="text-xs" /> Back to Home
      </NuxtLink>
    </div>
    <hr />
    <leave-form></leave-form>
  </div>
</template>

<script>
export default {
  name: 'PersonalLeave',
  mounted: () => {
    document.title = 'Personal Leave';
  },
};
</script>
