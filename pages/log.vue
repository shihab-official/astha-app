<template>
  <div>
    <h1>Log update</h1>
    <hr />
    <a-form
      :layout="formLayout"
      :form="form"
      @submit="submit"
    >
      <a-form-item label="Date">
        <a-date-picker
          :format="dateFormat"
          :disabled-date="disabledDate"
          v-decorator="[
            'log.date',
            { initialValue: log.date, rules: [{ required: true, message: 'Please select date.' }] },
          ]"
        />
      </a-form-item>
      <a-form-item label="Log">
        <a-textarea
          placeholder="Update log"
          v-decorator="[
            'log.content',
            {
              rules: [
                { required: true, message: 'Please provide task update.' },
              ],
            },
          ]"
          :auto-size="{ minRows: 4 }"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit"> Submit </a-button>
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
      formLayout: 'vertical',
      form: this.$form.createForm(this),
      dateFormat: 'DD-MMM-YYYY',
      log: {
        date: moment(new Date()),
        content: '',
      },
      // date: moment(new Date()),
      // log: '',
    };
  },
  mounted: () => {
    document.title = 'Log Work Update';
  },
  methods: {
    disabledDate(current) {
      return current > moment().endOf('day');
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios
            .post(`/api/post-log`, {
              email: this.$auth.user.email,
              date: values.log.date.format('YYYYMMDD'),
              log: values.log.content,
            })
            .then((res) => {
              if (res.status == 200) {
                this.$router.push(`/${this.$auth.user.email}`);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },
  },
};
</script>
