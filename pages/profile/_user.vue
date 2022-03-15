<template>
  <div>
    <div class="flex items-baseline">
      <h3 class="m-0">
        <template v-if="currentUser">My Profile</template>
        <template v-else>Profile of {{ user.short_name }}</template>
      </h3>
      <NuxtLink to="/users" class="ml-5 text-gray-400 text-sm">
        <a-icon type="double-left" class="text-xs" /> Back to Users
      </NuxtLink>
    </div>
    <hr />
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <fieldset>
        <legend> Personal</legend>
        <div class="flex flex-wrap -mx-3">
          <a-form-item label="Name">
            <a-input
              :read-only="!currentUser && !currentUserIsAdminOrManager"
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
              :read-only="!currentUser && !currentUserIsAdminOrManager"
              v-decorator="['short_name', { initialValue: user.short_name }]"
            />
          </a-form-item>
          <a-form-item label="Email">
            <a-input :default-value="user.email" readOnly />
          </a-form-item>
          <a-form-item label="Mobile">
            <a-input
              :read-only="!currentUser && !currentUserIsAdminOrManager"
              v-decorator="['mobile', { initialValue: user.mobile }]"
            />
          </a-form-item>
          <a-form-item label="Date of Birth">
            <a-date-picker
              class="input-field-sm"
              :read-only="!currentUser && !currentUserIsAdminOrManager"
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
        </div>
      </fieldset>
      <fieldset>
        <legend> Official </legend>
        <div class="flex flex-wrap -mx-3">
          <a-form-item label="Joining Date">
            <a-month-picker
              class="input-field-sm"
              :read-only="!currentUser && !currentUserIsAdminOrManager"
              format="MMMM, YYYY"
              :allow-clear="false"
              v-decorator="[
                'joining_date',
                {
                  initialValue: user.joining_date,
                  rules: [
                    { required: true, message: 'Please select joining date.' },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="Leaves Taken">
            <a-input
              class="input-field-sm"
              :read-only="!currentUserIsAdminOrManager"
              v-decorator="['leaves_taken', { initialValue: user.leaves_taken }]"
            />
          </a-form-item>
          <div class="flex" v-if="currentUserIsAdmin">
            <a-form-item label="Admin" style="width: 100px;">
              <a-switch
                :default-checked="user.admin"
                :disabled="
                  (user.admin && !currentUser) || (currentUser && adminCount < 2)
                "
                v-decorator="['admin']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
            <a-form-item label="Manager" style="width: 100px;">
              <a-switch
                :default-checked="user.manager"
                v-decorator="['manager']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
            <a-form-item label="Show log" style="width: 100px;">
              <a-switch
                :default-checked="user.show_log"
                v-decorator="['show_log']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
          </div>
        </div>
      </fieldset>
      <a-form-item v-if="currentUser || currentUserIsAdmin" style="padding: 0">
        <a-button type="primary" html-type="submit"> Save </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.ant-form-item {
  width: calc(100% / 3);
  padding: 0 0.75rem;
}
.input-field-sm {
  width: 200px;
}
fieldset, fieldset legend {
  all: revert;
}
fieldset {
  border: solid 1px #dfe2e7;
  padding: 15px 20px 0;
  margin: 20px 0;
}
fieldset legend {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  padding: 0 6px;
  opacity: 0.6;
}
</style>

<script>
import moment from 'moment';
import { mapActions } from "vuex";

export default {
  name: 'profile',
  async asyncData({ $axios, $auth, params }) {
    const resData = await $axios
      .get('/api/user', {
        params: {
          id: params.user || $auth.user.id,
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
        this.$route.params.user &&
        this.$route.params.user !== this.$auth.user.id
      );
    },
    currentUserIsAdmin() {
      return this.$auth.user.admin;
    },
    currentUserIsManager() {
      return this.$auth.user.manager;
    },
    currentUserIsAdminOrManager() {
      return this.$auth.user.admin || this.$auth.user.manager;
    },
  },
  methods: {
    ...mapActions('user', ['setUser']),
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
        userData.id = this.user.email.replace('@asthait.com', '');
        userData.dob = moment(userData.dob).format('DD-MMM-YYYY');

        if (userData.joining_date) {
          userData.joining_date = moment(userData.joining_date).format('MMMM, YYYY');
        }

        if (!err) {
          this.$axios
            .post('/api/user', userData)
            .then((res) => {
              if (res.status == 200) {
                if (this.currentUser) {
                  this.$auth.setUser({ ...this.$auth.user, ...userData });
                }
                this.setUser(userData);
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
