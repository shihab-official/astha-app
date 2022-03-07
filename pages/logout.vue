<template></template>
<script>
export default {
  beforeMount() {
    this.$auth.logout('google').then(() => {
      this.$router.push('/login');
    });
  },
};
</script>
