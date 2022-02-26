<template>
  <div>
    <div class="header flex">
      <h1 class="m-0 mr-auto"> {{heading}} </h1>
      <NuxtLink
        to="/log"
        class="text-sm h-fit py-2 px-4 mr-3 bg-sky-500 text-white hover:bg-sky-600 hover:text-white rounded"
        >Log work update</NuxtLink
      >
      <NuxtLink
        to="/leave"
        class="text-sm h-fit py-2 px-4 bg-slate-600 text-white hover:bg-slate-700 hover:text-white rounded"
        >Apply for leave</NuxtLink
      >
    </div>
    <hr />
    <div class="logs" v-if="logs.length > 0">
      <details v-for="logData in logs" :key="logData.date" class="font-mono px-1 py-1" :class="logData.log.type">
        <summary class="text-slate-700 hover:opacity-75 cursor-pointer pb-1" :class="logData.log.type === 'leave' ? 'text-red-500' : ''">
          {{ logData.date }}
        </summary>
        <div class="text-sm rounded px-3.5 py-2.5 ml-3 drop-shadow-md" :class="logData.log.type === 'leave' ? 'bg-red-50' : 'bg-sky-50'">
          <pre>{{ logData.log.content || logData.log.reason }}</pre>
        </div>
      </details>
    </div>
    <div v-else><a-empty /></div>
  </div>
</template>

<style scoped>
summary {
  font-weight: 600;
}
summary::marker {
  font-size: 80%;
}
</style>

<script>
export default {
  middleware({ params, $auth, redirect }) {
    if (!$auth.user.isAdmin && params.email != $auth.user.email) {
      return redirect(`/${$auth.user.email}`);
    }
  },
  async asyncData({ params, redirect, $auth, $axios }) {
    const content = await $axios
      .get(`/api/user-log`, {
        params: {
          email: params.email,
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(error);
      });

    return {
      heading: params.email === $auth.user.email ? 'My Board' : `Board of ${content.user.name}`,
      logs: content.logs,
    };
  },
  // data() {
  //   return {
  //     heading: '',
  //     logs: []
  //   }
  // },
  mounted: function() {
    document.title = 'Work Update';
    // this.showLogs();
  },
  // methods: {
  //   showLogs: function() {
  //     this.$axios
  //       .get(`/api/user-log`, {
  //         params: {
  //           email: this.$route.params.email
  //         },
  //       })
  //       .then((res) => {
  //         this.heading = this.$route.params.email === this.$auth.user.email ? 'My Board' : `Board of ${res.data.user.name}`
  //         this.logs = res.data.logs;
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }
};
</script>
