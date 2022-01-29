<template>
  <div>
    <h3>Welcome to APP-DIRECTORY...</h3>
    <test>Test Button</test>
    <button @click="$auth.loginWith('google')">Login with Google</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  auth: false
});
</script>
