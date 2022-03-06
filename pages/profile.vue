<template>
  <div>
    <h2 v-if="currentUser">My Profile</h2>
    <h2 v-else>Profile of {{ user.short_name }}</h2>
    <hr />
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <div class="flex flex-wrap -mx-3">
        <a-form-item label="Name">
          <a-input
            :disabled="!currentUser && !$auth.user.admin"
            v-decorator="[
              'user.name',
              {
                initialValue: user.name,
                rules: [{ required: true, message: 'Please provide name.' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Short Name">
          <a-input
            :disabled="!currentUser && !$auth.user.admin"
            v-decorator="['user.short_name', { initialValue: user.short_name }]"
          />
        </a-form-item>
        <a-form-item label="Email">
          <a-input :default-value="user.email" disabled />
        </a-form-item>
        <a-form-item label="Mobile">
          <a-input
            :disabled="!currentUser && !$auth.user.admin"
            v-decorator="['user.mobile', { initialValue: user.mobile }]"
          />
        </a-form-item>
        <a-form-item label="Date of Birth">
          <a-date-picker
            :disabled="!currentUser && !$auth.user.admin"
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
        <div class="flex" v-if="$auth.user.admin">
          <a-form-item label="Admin" style="width: 100px; margin: 0">
            <a-switch
              :default-checked="user.admin"
              :disabled="user.admin && !currentUser"
              v-decorator="['user.admin']"
              checked-children=" Yes "
              un-checked-children=" No "
            />
          </a-form-item>
          <template>
            <a-form-item label="Manager" style="width: 100px; margin: 0">
              <a-switch
                :default-checked="user.manager"
                v-decorator="['user.manager']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
            <a-form-item label="Show log" style="width: 100px; margin: 0">
              <a-switch
                :default-checked="user.show_log"
                v-decorator="['user.show_log']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
          </template>
        </div>
      </div>
      <a-form-item v-if="currentUser || $auth.user.admin" style="padding: 0">
        <a-button type="primary" html-type="submit"> Save </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.ant-form-item {
  width: 50%;
  padding: 0 0.75rem;
}
</style>

<script>
import moment from 'moment';

export default {
  name: 'profile',
  async asyncData({ $axios, $auth, query }) {
    const user = await $axios
      .get('/api/user', {
        params: {
          email: query.email || $auth.user.email
        },
      })
      .then((res) => res.data)
      .catch((error) => console.error(error));

    user.short_name = user.short_name || user.name;
    user.dob = moment(user.dob || '01-Jan-1980', 'DD-MMM-YYYY');

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
  computed: {
    currentUser() {
      return !(
        this.$route.query.email &&
        this.$route.query.email !== this.$auth.user.email
      );
    },
  },
  methods: {
    disabledDate(current) {
      return current > moment().startOf('day');
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        const user = values.user;
        const userProps = Object.keys(user);
        for (let prop of userProps) {
          if (user[prop] === null || user[prop] === undefined) {
            delete user[prop];
          }
        }
        user.email = this.user.email;
        user.dob = moment(user.dob).format('DD-MMM-YYYY');
        if (!err) {
          this.$axios
            .post(`/api/user`, user)
            .then((res) => {
              if (res.status == 200) {
                this.$message[res.data.type](res.data.message);
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
