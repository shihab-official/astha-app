<template>
  <div>
    <h3>Welcome to APP-DIRECTORY...</h3>
    <test>Test Button</test>
    <button v-if="$auth.loggedIn" @click="$auth.logout('google')">Logout</button>
    <button v-else @click="$auth.loginWith('google')">Login with Google</button>
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
    console.log(this.$auth);
  }

});
</script>
