<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">
        Time Log ~
        <a-date-picker
          style="font-size: inherit;"
          :value="date"
          :format="dateFormat"
          @change="onDateChange(date, $event)"
        >
          <span class="cursor-pointer">{{ date.format(dateFormat) }}</span>
        </a-date-picker>
      </h3>
      <div class="space-x-3">
        <a-button
          type="primary"
          @click="updateHolidays($message.success, $message.error)"
          style="height: 28px"
        >
          Update
        </a-button>
      </div>
    </div>
    <hr />
    <div class="table-wrapper" v-if="users && users.length > 0">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th class="w-1/5 text-center">Entry</th>
            <th class="w-1/5 text-center">Exit</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user of users"
            :key="user._id"
            class="text-sm"
          >
            <td>{{ user.short_name }}</td>
            <td class="text-center relative">
              <a-time-picker style="width:100%;" use12-hours :value="logs[user.user_name] && logs[user.user_name].entry" :format="timeFormat" @change="onTimeChange(user.user_name, 'entry', $event)" />
            </td>
            <td class="text-center relative">
              <a-time-picker style="width:100%;" use12-hours :value="logs[user.user_name] && logs[user.user_name].exit" :format="timeFormat" @change="onTimeChange(user.user_name, 'exit', $event)" />
              <!-- <a-time-picker style="width:100%;" use12-hours format="h:mm a" @change="onChange(user)" /> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.ant-calendar-picker {
  color: inherit;
}
.ant-time-picker >>> input {
  text-align: center;
  background-color: transparent;
  border: 0;
}
.ant-time-picker >>> .ant-time-picker-icon {
  display: none;
}
</style>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'TimeLog',
  async asyncData({ redirect, $auth, $axios }) {
    await $axios
      .get(`user/${$auth.user.user_name}`)
      .then((res) => {
        if (!res.data.user.admin && !res.data.user.manager) {
          return redirect(`/`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  data() {
    return {
      dateFormat: 'DD-MMM-YYYY',
      timeFormat: 'h:mm a',
      date: moment('26-Apr-2022', this.dateFormat),
      logs: {}
    };
  },
  computed: {
    ...mapGetters('user', ['users']),
  },
  watch: {
    date: function (newDate, oldDate) {
      this.getTimeLog(newDate);
    },
  },
  mounted: function () {
    document.title = 'Time Log';
    this.getTimeLog(this.date);
  },
  methods: {
    moment,

    onDateChange(holiday, moment) {
      this.date = moment;
    },

    onTimeChange(user_name, type, moment) {
      this.logs = {
        ...this.logs,
        [user_name]: {
          [type]: moment.format(this.timeFormat)
        }
      };
    },

    getTimeLog(date) {
      this.$axios
        .get('/log/time', {
          params: {
            date: date.format(this.dateFormat)
          },
        })
        .then((res) => {
          res.data.forEach(log => {
            this.logs[log.user_name] = { entry: moment(log.entry), exit: moment(log.exit) };
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },
};
</script>
