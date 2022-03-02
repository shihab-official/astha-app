<template>
  <div>
    <div class="header flex">
      <h1 class="m-0 mr-auto">{{ heading }}</h1>
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
      <details
        v-for="logData in logs"
        :key="logData.date"
        class="font-mono p-1"
      >
        <summary class="font-semibold text-slate-700 hover:opacity-75 cursor-pointer pb-1">
          {{ logData.date }}
        </summary>
        <div>
          <template v-for="(data, i) in logData.log">
            <pre
              :key="i"
              class="rounded px-3.5 py-2.5 ml-3 mb-2 drop-shadow-md"
              :class="`${data.reason ? 'bg-red-50' : 'bg-sky-50'} ${i === 1 ? 'mt-3' : ''}`"
              >{{ data.content || data.reason }}</pre
            >
          </template>
        </div>
      </details>
    </div>
    <div v-else><a-empty /></div>
  </div>
</template>

<style scoped>
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

    const logs = content.logs.map((userLog) => {
      const newLog = [];
      const keys = Object.keys(userLog.log);
      if (keys.length === 1) {
        newLog.push(userLog.log[keys[0]]);
      } else if (keys.length === 2) {
        newLog.push(userLog.log.work);
        newLog.splice(userLog.log.leave.option, 0, userLog.log.leave);
      }
      return { ...userLog, log: newLog };
    });

    return {
      heading:
        params.email === $auth.user.email
          ? 'My Board'
          : content.user.name,
      logs: logs,
    };
  },
  // data() {
  //   return {
  //     heading: '',
  //     logData: []
  //   }
  // },
  mounted: function () {
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
  //         this.logData = res.data.logs;
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }
};
</script>
