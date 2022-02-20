<template>
  <div>
    <h3><span class="font-normal">Welcome to App-Directory</span> <span class="user">{{ $auth.user.given_name }}</span>.</h3>
    <br />
    Please select your purpose of visit.
    <ul>
      <li>
        <nuxt-link to="/work-update">Work update</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/personal-leave">Personal leave</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted: function () {
    document.title = 'App Directory';
    console.log('AUTH', this.$auth);
  },
};
</script>
