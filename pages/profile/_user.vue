<template>
  <div>
    <div class="flex items-baseline">
      <Back to="/users" />
      <h3 class="m-0">
        <template v-if="currentUser">My Profile</template>
        <template v-else>{{ user.short_name }}'s Profile</template>
      </h3>
      <NuxtLink
        :to="`/logs/${user.user_name}`"
        class="ml-auto text-sm font-medium"
      >
        Check Logs
      </NuxtLink>
    </div>
    <hr />
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <fieldset>
        <legend>Personal</legend>
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
              dropdownClassName="dob-picker"
              :read-only="!currentUser && !currentUserIsAdminOrManager"
              format="DD-MMMM"
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
        <legend>Official</legend>
        <div class="flex flex-wrap -mx-3">
          <a-form-item label="Joining Date" class="w-1/3">
            <a-month-picker
              class="input-field-sm"
              :disabled="!currentUser && !currentUserIsAdminOrManager"
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
          <div class="w-2/3 flex">
            <a-form-item label="Leave Offset" class="w-1/3">
              <a-input-number
                style="width: 100%;"
                :disabled="!currentUserIsAdminOrManager"
                placeholder="Offset"
                @change="leaveOffsetChange" :min="0"
                :max="maxLeaveOffset"
                v-decorator="[
                  'leave_offset',
                  { initialValue: user.leave_offset || 0, type: 'number' },
                ]"
              />
            </a-form-item>
            <a-form-item label="Leaves Taken" class="w-1/3">
              <div class="ant-input leave-input disabled">
                {{user.leaves_taken}}
              </div>
            </a-form-item>
            <a-form-item :label="remainingLeaves >= 0 ? 'Remaining' : 'Extra'" class="w-1/3">
              <div class="ant-input leave-input disabled text-center">
                {{remainingLeaves >= 0 ? remainingLeaves : -remainingLeaves}}
              </div>
            </a-form-item>
          </div>
        </div>
        <div v-if="currentUserIsAdmin" class="flex flex-wrap -mx-3">
          <a-form-item label="Admin" style="width: 100px">
            <a-switch
              :default-checked="user.admin"
              :disabled="adminCount < 2"
              v-decorator="['admin']"
              checked-children=" Yes "
              un-checked-children=" No "
            />
          </a-form-item>
          <a-form-item label="Manager" style="width: 100px">
            <a-switch
              :default-checked="user.manager"
              v-decorator="['manager']"
              checked-children=" Yes "
              un-checked-children=" No "
            />
          </a-form-item>
          <a-form-item label="Team Lead" style="width: 100px">
            <a-switch
              :default-checked="user.team_lead"
              v-decorator="['team_lead']"
              checked-children=" Yes "
              un-checked-children=" No "
            />
          </a-form-item>
          <a-form-item label="Show log" style="width: 100px">
            <a-switch
              :default-checked="user.show_log"
              v-decorator="['show_log']"
              checked-children=" Yes "
              un-checked-children=" No "
            />
          </a-form-item>
        </div>

        <template v-if="currentUserIsAdmin">
          <hr style="border-color: rgb(255 0 0 / 31%);margin: 5px 0 20px;">
          <div class="flex flex-wrap -mx-3">
            <a-form-item label="Active" style="width: 100px">
              <a-switch
                :default-checked="user.active"
                v-decorator="['active']"
                checked-children=" Yes "
                un-checked-children=" No "
              />
            </a-form-item>
          </div>
        </template>
      </fieldset>
      <a-form-item v-if="currentUser || currentUserIsAdminOrManager" style="padding: 0">
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
  width: 175px;
}
.input-field-xs {
  width: 100px;
}
.leave-input {
  padding-left: 8px;
  padding-right: 8px;
}
</style>

<style>
  .dob-picker .ant-calendar {
    width: auto !important;
  }
  .dob-picker .ant-calendar-prev-year-btn,
  /* .dob-picker .ant-calendar-year-select, */
  .dob-picker .ant-calendar-next-year-btn {
    display: none;
  }
  .ant-calendar-header .ant-calendar-prev-month-btn {
    left: 18px;
  }
  .ant-calendar-header .ant-calendar-next-month-btn {
    right: 18px;
  }
</style>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Profile',
  async asyncData({ $axios, $auth, params }) {
    const resData = await $axios
      .get(`user/${params.user || $auth.user.user_name}`)
      .then((res) => res.data)
      .catch((error) => console.error(error));

    resData.user.short_name = resData.user.short_name || resData.user.name;
    if (resData.user.dob) {
      resData.user.dob = moment(resData.user.dob || '01-Jan', 'DD-MMM');
    }

    return { loading: false, ...resData };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      loading: true,
      formLayout: 'vertical'
    };
  },
  mounted: function () {
    document.title = 'Profile';
  },
  computed: {
    ...mapGetters(['personalLeaves']),
    maxLeaveOffset() {
      const maxLeaveOffset = this.personalLeaves - this.user.leaves_taken;
      return maxLeaveOffset < 0 ? 0 : maxLeaveOffset;
    },
    totalLeaves() {
      return this.user.leaves_taken + (this.user.leave_offset || 0);
    },
    remainingLeaves() {
      return parseFloat((this.personalLeaves - this.totalLeaves).toFixed(2));
    },
    currentUser() {
      return !(
        this.$route.params.user &&
        this.$route.params.user !== this.$auth.user.user_name
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
    ...mapActions('user', ['setUser', 'getUsers']),
    disabledDate(current) {
      return current < moment().startOf('year') || current > moment().endOf('year');
    },
    leaveOffsetChange(value) {
      this.user.leave_offset = value;
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
        userData.user_name = this.user.email.replace('@asthait.com', '');
        userData.dob = moment(userData.dob).format('DD-MMM');

        if (userData.joining_date) {
          userData.joining_date = moment(userData.joining_date).format(
            'MMMM, YYYY'
          );
        }

        if (!err) {
          this.$axios
            .put('user/update', userData)
            .then((res) => {
              if (res.status == 200) {
                if (this.currentUser) {
                  this.$auth.setUser({ ...this.$auth.user, ...userData });
                }
                this.setUser(userData);
                this.getUsers();
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
