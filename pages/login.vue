<template>
  <div>
    <h3>Welcome to APP-DIRECTORY.</h3>
    <button v-if="$auth.loggedIn" @click="$auth.logout('google')">
      Logout
    </button>
    <button v-else @click="login()">Login with Google</button>
  </div>
</template>

<script>
export default {
  mounted() {
    document.title = 'Login';
    // if (this.$auth.loggedIn) {
    //   this.$router.push('/');
    // }
  },
  methods: {
    login() {
      this.$auth.loginWith('google');
    },
  },
};
</script>
