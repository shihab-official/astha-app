<template>
  <div>
    <h3>Welcome to APP-DIRECTORY...</h3>
    <test @click="log($event)">Test Button</test>
    <button v-if="$auth.loggedIn" @click="$auth.logout('google')">Logout</button>
    <button v-else @click="login()">Login with Google</button>
    <div v-if="$auth.loggedIn">
      <div>{{$auth.user.given_name}}</div>
      <div>{{$auth.user.email}}</div>
      <div>{{$auth.hasScope('admin')}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  auth: false,
  mounted: function () {
    document.title="App Directory";
    console.log(this.$auth);
  },
  methods: {
    login() {
      this.$auth.loginWith('google');
    },
    log(event: any) {
      console.log(event);
    }
  }
});
</script>
