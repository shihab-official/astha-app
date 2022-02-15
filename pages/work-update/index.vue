<template>
  <div>
    <div class="header flex justify-between">
      <h1 class="m-0">Work log</h1>
      <NuxtLink
        to="/work-update/log"
        class="py-1 px-4 bg-sky-500 text-white hover:bg-sky-600 hover:text-white rounded"
        >Log</NuxtLink
      >
    </div>
    <hr />
    <ul>
      <li v-for="user in users" :key="user.email">
        <NuxtLink :to="`/work-update/${user.email}`">{{ user.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
import { ADMIN_EMAILS } from '~/constants';
export default {
  name: 'Work-Update',
  middleware({redirect, $auth}) {
    if(!$auth.user.isAdmin){
     return redirect(`/work-update/${$auth.user.email}`);
    }
  },
  data() {
    return {
      users: [],
    };
  },
  mounted: function () {
    document.title = 'Work Update';
    this.$axios
      .get(`/api/users`)
      .then((res) => {
        this.users = res.data.filter(user => {
          if (!user.admin) {
            return user;
          }
        });
      })
      .catch((error) => {
        // console.error(error);
      });
  },
};
</script>
