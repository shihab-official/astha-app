<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Export</h3>
    </div>
    <hr />
    <div>
      <fieldset>
        <legend>Time log</legend>
        <div>
          <a-button type="primary" @click="exportTimeLog()" style="height: 28px;"> Export </a-button>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
  fieldset {
    padding-bottom: 20px;
  }
</style>

<script>
export default {
  name: 'Export',
  async asyncData({ redirect, $auth, $axios }) {
    await $axios
      .get(`user/${$auth.user.user_name}`)
      .then((res) => {
        if (!res.data.user.admin && !res.data.user.manager) {
          return redirect(`/`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  mounted() {
    document.title = 'Export';
  },
  methods: {
    exportTimeLog() {
      this.$axios
        .post('/export/time-log')
        .then(res => {
          console.log(res.data);
        })
    },
  },
};
</script>
