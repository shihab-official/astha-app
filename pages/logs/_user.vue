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
      <span class="leave-stat ml-auto px-2 flex items-center font-medium border border-solid border-red-500 relative rounded overflow-hidden">
        <span class="progress absolute top-0 left-0 bottom-0 pointer-events-none bg-red-100" :style="{width: `${leaveProgress}%`}"></span>
        <small class="mr-2 relative">Leaves remaining</small>
        <span class="relative">{{leavesRemaining}}</span>
      </span>
    </div>
    <hr />
    <div class="logs" v-if="logs.length > 0">
      <details
        v-for="logData in logs"
        :key="logData.date"
        class="font-mono p-1"
      >
        <summary
          class="font-semibold text-slate-700 w-fit hover:opacity-75 cursor-pointer pb-1"
        >
          {{ logData.date }}
          <a-tag v-if="logData.leave" color="red" class="pointer-events-none">
            {{ logData.leave }}
          </a-tag>
        </summary>
        <div>
          <template v-for="(data, i) of logData.log">
            <div
              :key="i"
              class="flex rounded px-3.5 py-2.5 ml-3 mb-2 drop-shadow-md"
              :class="`${data.reason ? 'bg-red-50' : 'bg-sky-50'} ${
                i === 1 ? 'mt-3' : ''
              }`"
            >
              <pre class="flex-grow mr-3">{{
                data.content || data.reason
              }}</pre>
              <a-popconfirm
                v-if="($auth.user.admin || $auth.user.manager) && data.reason"
                placement="left"
                title="Cancel this leave? Are you sure?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="cancelLeave(logData)"
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
        </div>
      </details>
    </div>
    <div v-else><a-empty /></div>
  </div>
</template>

<style scoped>
summary::marker {
  font-size: 80%;
}
</style>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'UserLogs',
  middleware({ params, $auth, redirect }) {
    if (
      !$auth.user.admin &&
      !$auth.user.manager &&
      params.user != $auth.user.user_id
    ) {
      return redirect(`/logs/${$auth.user.user_id}`);
    }
  },
  async asyncData({ params, redirect, $auth, $axios }) {
    const content = await $axios
      .get(`/log/${params.user}`)
      .then((res) => res.data)
      .catch((error) => {
        console.error(error);
      });

    return {
      user: content.user,
      heading: params.user === $auth.user.user_id ? 'My Board' : content.user.name,
      userLogs: content.logs,
    };
  },
  mounted: function () {
    document.title = 'Work Update';
  },
  computed: {
    ...mapGetters(['personalLeaves']),
    leavesTaken() {
      return (+this.user.leave_offset || 0) + (+this.user.leaves_taken || 0);
    },

    leavesRemaining() {
      return this.personalLeaves - this.leavesTaken;
    },

    leaveProgress() {
      return parseInt(this.leavesTaken / this.personalLeaves * 100);
    },
    
    logs() {
      return this.userLogs.map((userLog) => {
        const newLog = [];
        let leave = '';
        const keys = Object.keys(userLog.log);
        if (keys.length === 1) {
          newLog.push(userLog.log[keys[0]]);
        } else if (keys.length === 2) {
          newLog.push(userLog.log.work);
          newLog.splice(userLog.log.leave.option, 0, userLog.log.leave);
        }
        if (userLog.log.leave) {
          leave =
            userLog.log.leave.option === 0
              ? '1st Half'
              : userLog.log.leave.option === 1
              ? '2nd Half'
              : 'Full day';
        }
        return { ...userLog, log: newLog, leave };
      });
    },
  },
  methods: {
    ...mapActions('calendar', ['deleteLeaveInfo']),
    // ...mapActions('user', ['updateLeaveCount']),

    cancelLeave: function (data) {
      const leaveOption = data.log.find((l) => l.reason).option;
      const log = { work: data.log.find((l) => l.content) };
      this.$axios
        .post('/leave/cancel', {
          log,
          duration: (leaveOption === 2 ? 1 : 0.5),
          userID: this.user.user_id,
          date: moment(data.date, 'DD-MMM-YYYY').format('YYYYMMDD'),
        })
        .then((res) => {
          if (res.status == 200) {
            const index = this.userLogs.findIndex((d) => d.date === data.date);
            if (data.log.length === 2) {
              this.userLogs.splice(index, 1, { date: data.date, log });
            } else {
              this.userLogs.splice(index, 1);
            }
            this.deleteLeaveInfo({ date: data.date, userID: this.user.user_id });
            this.user.leaves_taken -= (leaveOption === 2 ? 1 : 0.5);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
