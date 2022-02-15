<template>
  <div>
    <h1>Log update</h1>
    <a-form>
      <a-form-item label="Date">
        <a-date-picker @change="onChange" :value="date" :format="dateFormat" />
      </a-form-item>
      <a-form-item label="Log">
        <a-textarea placeholder="Update log" v-model="log" :rows="4" />
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
      dateFormat: 'DD-MMM-YYYY',
      date: moment(new Date()),
      log: '',
    };
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
        .post(`/api/log`, {
          email: this.$auth.user.email,
          date: this.date?.format('DD-MMM-YYYY'),
          log: this.log,
        })
        .then((res) => {
          if(res.status == 200) {
            this.$router.push(`/work-update/${this.$auth.user.email}`);
          }
        })
        .catch((error) => {
          // console.error(error);
        });
    },
  },
};
</script>
