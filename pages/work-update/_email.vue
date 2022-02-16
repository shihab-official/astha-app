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
    <div class="logs">
      <a-collapse class="log">
        <a-collapse-panel
          v-for="log in logs"
          :key="log.date"
          :header="log.date"
        >
          <div v-nl2br>{{ log.content }}</div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
export default {
  middleware({params, $auth, redirect}) {
    if(!$auth.user.isAdmin && params.email != $auth.user.email) {
     return redirect(`/work-update/${$auth.user.email}`);
    }
  },
  async asyncData({ params, redirect, $axios }) {
    const content = await $axios
      .get(`/api/log`, {
        params: {
          email: params.email,
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(error);
      });
    return {
      // logs: content.map(l => ({...l, content: l.content.replace(/(?:\r\n|\r|\n)/g, '<br>')}))
      logs: content
    };
  },
  mounted: () => {
    document.title = 'Work Update';
  },
  directives: {
    nl2br: {
      inserted(el) {
        el.innerHTML = el.textContent.replace(/(?:\r\n|\r|\n)/g, '<br />');
      },
    },
  },
};
</script>
