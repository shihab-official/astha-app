<template>
  <div>
    <h2>Profile</h2>
    <hr />
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <a-form-item label="Name">
        <a-input
          v-decorator="[
            'user.name',
            { initialValue: user.name, rules: [{ required: true, message: 'Please provide name.' }] },
          ]"
        />
      </a-form-item>
      <a-form-item label="Short Name">
        <a-input v-decorator="['user.short_name', { initialValue: user.short_name }]" />
      </a-form-item>
      <a-form-item label="Email">
        <a-input :default-value="user.email" disabled />
      </a-form-item>
      <a-form-item label="Date of Birth">
        <a-date-picker
          :format="dateFormat"
          :disabled-date="disabledDate"
          :allow-clear="false"
          v-decorator="[
            'user.dob',
            {
              initialValue: user.dob,
              rules: [
                { required: true, message: 'Please select date of birth.' },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="Mobile">
        <a-input v-decorator="['user.mobile', { initialValue: user.mobile }]" />
      </a-form-item>
      <a-form-item v-if="user.admin" label="Admin">
        <a-switch :default-checked="user.admin" :disabled="user.email !== $auth.user.email" v-decorator="['user.admin']" checked-children="Yes" un-checked-children="No" />
      </a-form-item>
      <a-form-item v-if="user.admin" label="Admin">
        <a-switch :default-checked="user.admin" :disabled="user.email !== $auth.user.email" v-decorator="['user.admin']" checked-children="Yes" un-checked-children="No" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit"> Save </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'profile',
  async asyncData({ $axios, $auth }) {
    const user = await $axios
      .get('/api/user', {
        params: {
          email: $auth.user.email,
        },
      })
      .then((res) => res.data)
      .catch((error) => console.error(error));

    user.short_name = user.short_name || user.name;
    user.dob = moment((user.dob || '01-Jan-1980'), 'DD-MMM-YYYY');

    return { loading: false, user };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      loading: true,
      formLayout: 'vertical',
      dateFormat: 'DD-MMM-YYYY',
    };
  },
  methods: {
    disabledDate(current) {
      return current > moment().startOf('day');
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
  },
};
</script>
