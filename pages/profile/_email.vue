<template>
  <div>
    <div class="flex items-baseline">
      <h3 class="m-0">
        <template v-if="currentUser">My Profile</template>
        <template v-else>Profile of {{ user.short_name }}</template>
      </h3>
    </div>
    <hr />
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <div class="flex flex-wrap -mx-3">
        <a-form-item label="Name">
          <a-input
            :read-Only="!currentUser && !currentUserIsAdmin"
            v-decorator="[
              'name',
              {
                initialValue: user.name,
                rules: [{ required: true, message: 'Please provide name.' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Short Name">
          <a-input
            :read-Only="!currentUser && !currentUserIsAdmin"
            v-decorator="['short_name', { initialValue: user.short_name }]"
          />
        </a-form-item>
        <a-form-item label="Email">
          <a-input :default-value="user.email" readOnly />
        </a-form-item>
        <a-form-item label="Mobile">
          <a-input
            :read-Only="!currentUser && !currentUserIsAdmin"
            v-decorator="['mobile', { initialValue: user.mobile }]"
          />
        </a-form-item>
        <a-form-item label="Date of Birth">
          <a-date-picker
            :read-Only="!currentUser && !currentUserIsAdmin"
            :format="dateFormat"
            :disabled-date="disabledDate"
            :allow-clear="false"
            v-decorator="[
              'dob',
              {
                initialValue: user.dob,
                rules: [
                  { required: true, message: 'Please select date of birth.' },
                ],
              },
            ]"
          />
        </a-form-item>
        <div class="flex" v-if="currentUserIsAdmin">
          <a-form-item label="Admin" style="width: 100px; margin: 0">
            <a-switch
              :default-checked="user.admin"
              :disabled="(user.admin && !currentUser) || (currentUser && adminCount < 2)"
              v-decorator="['admin']"
              checked-children=" Yes "
              un-checked-children=" No "
            />
          </a-form-item>
          <template>
            <a-form-item label="Manager" style="width: 100px; margin: 0">
              <a-switch
                :default-checked="user.manager"
                v-decorator="['manager']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
            <a-form-item label="Show log" style="width: 100px; margin: 0">
              <a-switch
                :default-checked="user.show_log"
                v-decorator="['show_log']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
          </template>
        </div>
      </div>
      <a-form-item v-if="currentUser || currentUserIsAdmin" style="padding: 0">
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
  async asyncData({ $axios, $auth, params }) {
    const resData = await $axios
      .get('/api/user', {
        params: {
          email: params.email || $auth.user.email,
        },
      })
      .then((res) => res.data)
      .catch((error) => console.error(error));

    resData.user.short_name = resData.user.short_name || resData.user.name;
    resData.user.dob = moment(resData.user.dob || '01-Jan-1980', 'DD-MMM-YYYY');

    return { loading: false, ...resData };
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
        this.$route.params.email &&
        this.$route.params.email !== this.$auth.user.email
      );
    },
    currentUserIsAdmin() {
      return this.$auth.user.admin;
    },
  },
  methods: {
    disabledDate(current) {
      return current > moment().startOf('day');
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        const userData = values;
        const userProps = Object.keys(userData);

        for (let prop of userProps) {
          if (userData[prop] === null || userData[prop] === undefined) {
            delete userData[prop];
          }
        }

        userData.email = this.user.email;
        userData.dob = moment(userData.dob).format('DD-MMM-YYYY');

        if (!err) {
          this.$axios
            .post(`/api/user`, userData)
            .then((res) => {
              if (res.status == 200) {
                if (this.currentUser) {
                  this.$auth.setUser({ ...this.$auth.user, ...userData });
                }
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
