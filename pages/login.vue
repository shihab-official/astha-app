<template>
  <div>
    <h3>Welcome to Astha IT Ventures.</h3>
    <h4 class="font-normal mb-5">Please sign in to continue.</h4>
    <button v-if="$auth.loggedIn" @click="$auth.logout('google')">
      Logout
    </button>
    <button
      class="login-button bg-white font-semibold rounded border-0 cursor-pointer p-2 drop-shadow-md hover:drop-shadow-lg"
      v-else
      @click="login()"
    >
      <img src="/img/google.svg" alt="Google Logo" class="w-7 ml-2" />
      <span class="mx-5">Sign In</span>
    </button>
  </div>
</template>

<style scoped>
.login-button {
  box-shadow: 0 0 3px rgb(0 0 0 / 7%);
}
</style>

<script>
export default {
  mounted() {
    document.title = 'Login';
    // if (this.$auth.loggedIn) {
    //   this.$router.push('/');
    // }
  },
  methods: {
    async login() {
      console.time('signing in');
      await this.$auth.loginWith('google');
      console.timeEnd('signing in');
    },
  },
};
</script>
