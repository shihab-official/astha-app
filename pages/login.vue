<template>
  <div class="text-center">
    <h4 v-if="$auth.loggedIn">Authenticated successfully. Redirecting shortly...</h4>
    <h4 v-else>Authentication failed. Please try again.</h4>
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$auth.loggedIn) {
      this.$router.push('/');
    }
  }
};
</script>
