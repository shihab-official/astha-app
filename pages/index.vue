<template>
  <div>
    <h3><span class="font-normal">Welcome to App-Directory</span> <span class="user">{{ $auth.user.given_name }}</span>.</h3>
    <br />
    Please select your purpose of visit.
    <ul>
      <li>
        <nuxt-link to="/work-update">Log work update</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/personal-leave">Apply for a leave</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Home',
  middleware: ['data-store'],
  mounted: function () {
    document.title = 'App Directory';
    console.log(this.$auth);
  },
});
</script>
