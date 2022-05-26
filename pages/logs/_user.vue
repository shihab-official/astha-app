<template>
  <div>
    <div class="flex items-baseline">
      <h3 class="m-0">{{ heading }}</h3>
      <NuxtLink
        v-if="$auth.user.admin"
        to="/logs/"
        class="ml-5 text-gray-400 text-sm"
      >
        <a-icon type="double-left" class="text-xs" /> Back to Logs
      </NuxtLink>
      <span
        v-if="currentUser"
        class="leave-stat ml-auto px-2 flex items-center font-medium border border-solid border-red-500 relative rounded overflow-hidden"
      >
        <span
          class="progress absolute top-0 left-0 bottom-0 pointer-events-none bg-red-100"
          :style="{ width: `${leaveProgress}%` }"
        ></span>
        <template v-if="leavesRemaining >= 0">
          <small class="mr-2 relative">Leaves remaining</small>
          <span class="relative">{{ leavesRemaining }}</span>
        </template>
        <template v-else>
          <small class="mr-2 relative">Extra Leaves</small>
          <span class="relative">{{ -leavesRemaining }}</span>
        </template>
      </span>
      <NuxtLink
        v-else
        :to="`/profile/${params.user}`"
        class="ml-auto text-sm font-medium"
      >
        Visit Profile
      </NuxtLink>
    </div>
    <hr />
    <div class="logs" v-if="logs.length > 0">
      <details
        v-for="(logData, i) in logs"
        :key="logData.date"
        class="font-mono p-1"
      >
        <summary
          class="font-semibold text-slate-700 hover:opacity-75 cursor-pointer pb-1"
        >
          <div class="inline-flex">
            {{ logData.date }}
            <div class="text-sm ml-4" style="line-height:24px;"> 
              <span class="text-green-600">{{logData.entry || ''}}</span>
              <template v-if="logData.exit">
                &ndash;
                <span class="text-red-600">{{logData.exit}}</span>
              </template>
            </div>
            <a-tag
              v-if="logData.leave"
              :color="logData.leave == 'Full day' ? 'red' : 'orange'"
              class="pointer-events-none" style="margin-left: 1rem;"
            >
              {{ logData.leave }}
            </a-tag>
          </div>
        </summary>
        <div>
          <template v-if="logData.log.length > 0">
            <template v-for="(data, j) of logData.log">
              <div
                :key="j"
                class="flex rounded px-3.5 py-2.5 ml-3 mb-2 drop-shadow-md"
                :class="`${
                  data.hasOwnProperty('option') ? 'bg-red-50' : 'bg-sky-50'
                } ${j === 1 ? 'mt-3' : ''}`"
              >
                <div class="log flex-grow text-sm" v-html="data.detail"></div>
                <a-popconfirm
                  v-if="
                    ($auth.user.admin || $auth.user.manager) &&
                    data.hasOwnProperty('option')
                  "
                  placement="left"
                  title="Cancel this leave? Are you sure?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="cancelLeave(logData, i)"
                >
                  <a-icon
                    slot="icon"
                    type="question-circle-o"
                    style="color: red"
                  />
                  <span
                    class="-mr-3.5 -my-2.5 p-3 cursor-pointer"
                    title="Cancel Leave"
                  >
                    <a-icon type="delete" theme="twoTone" two-tone-color="#f00" />
                  </span>
                </a-popconfirm>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="flex rounded bg-gray-100 px-3.5 py-2.5 ml-3 mb-2 drop-shadow-md text-sm">Log not submitted.</div>
          </template>
        </div>
      </details>
    </div>
    <div v-else><a-empty /></div>
  </div>
</template>

<style scoped>
details:not(:first-child) {
  border-top: solid 1px #efefef;
}
summary::marker {
  font-size: 75%;
}
.log {
  margin-bottom: -0.5rem;
}
</style>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'UserLogs',
  middleware({ params, $auth, redirect }) {
    if (!$auth.loggedIn) {
      return redirect(`/login`);
    }

    if (
      !$auth.user.admin &&
      !$auth.user.manager &&
      params.user != $auth.user.user_name
    ) {
      return redirect(`/logs/${$auth.user.user_name}`);
    }
  },
  async asyncData({ params, redirect, $auth, $axios }) {
    const content = await $axios
      .get(`log/${params.user}`)
      .then((res) => res.data)
      .catch((error) => {
        console.error(error);
      });

    return {
      // currentUser: params.user === $auth.user.user_name,
      user: content.user,
      heading:
        params.user === $auth.user.user_name
          ? 'My Board'
          : content.user.short_name,
      userLogs: content.logs,
    };
  },
  mounted: function () {
    document.title = 'Work Update';
  },
  computed: {
    ...mapGetters(['personalLeaves']),
    params() {
      return this.$route.params;
    },

    currentUser() {
      return this.params.user === this.$auth.user.user_name;
    },

    leavesTaken() {
      return (+this.user.leave_offset || 0) + (+this.user.leaves_taken || 0);
    },

    leavesRemaining() {
      return this.personalLeaves - this.leavesTaken;
    },

    leaveProgress() {
      return parseInt((this.leavesTaken / this.personalLeaves) * 100);
    },

    logs() {
      return this.userLogs.map((userLog) => {
        const newLog = [];
        let leave = '';
        userLog.date = moment(userLog.date).format('DD-MMM-YYYY');

        if (userLog.work && userLog.leave) {
          newLog.push(userLog.work);
          newLog.splice(userLog.leave.option, 0, userLog.leave);
        } else if (userLog.work) {
          newLog.push(userLog.work);
        } else if (userLog.leave) {
          newLog.push(userLog.leave);
        }

        let entry = userLog.entry ? moment(userLog.entry).format('h:mm A') : null;
        let exit = userLog.exit ? moment(userLog.exit).format('h:mm A') : null;

        if (userLog.leave) {
          leave =
            userLog.leave.option === 0
              ? '1st Half'
              : userLog.leave.option === 1
              ? '2nd Half'
              : 'Full day';

          if (userLog.leave.option == 2) {
            entry = null;
            exit = null;
          }
        }
        return { _id: userLog._id, date: userLog.date, log: newLog, leave, entry, exit };
      });
    },
  },
  methods: {
    ...mapActions('calendar', ['getLeaveInfo']),
    // ...mapActions('user', ['updateLeaveCount']),

    cancelLeave: function (data, index) {
      this.$axios
        .delete('leave/cancel', {
          data: {
            leave_id: data._id,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            const log = this.userLogs[index];
            if (log.work) {
              delete log.leave;
              this.userLogs.splice(index, 1, log);
            } else {
              this.userLogs.splice(index, 1);
            }
            this.getLeaveInfo();
            this.user.leaves_taken = res.data;
            this.$auth.setUser({ ...this.$auth.user, leaves_taken: res.data });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
