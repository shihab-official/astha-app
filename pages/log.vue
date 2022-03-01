<template>
  <div>
    <h1>Log update</h1>
    <hr />
    <a-form>
      <a-form-item label="Date">
        <a-date-picker @change="onChange" :value="date" :format="dateFormat" />
      </a-form-item>
      <a-form-item label="Log">
        <a-textarea
          placeholder="Update log"
          v-model="log"
          :auto-size="{ minRows: 4 }"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="submit()"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Log-Work-Update',
  data() {
    return {
      date: moment(new Date()),
      log: '',
    };
  },
  computed: {
    dateFormat: function () {
      return 'DD-MMM-YYYY';
    },
  },
  mounted: () => {
    document.title = 'Log Work Update';
  },
  methods: {
    onChange: function (m) {
      this.date = m;
    },
    submit: function () {
      this.$axios
        .post(`/api/post-log`, {
          email: this.$auth.user.email,
          log: {
            [this.date?.format('YYYYMMDD')]: {
              work: {
                content: this.log,
              },
            },
          },
        })
        .then((res) => {
          if (res.status == 200) {
            this.$router.push(`/${this.$auth.user.email}`);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
