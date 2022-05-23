<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">
        Time Log ~
        <a-date-picker
          style="font-size: inherit"
          :disabled-date="disabledDate"
          :value="date"
          :format="config.dateFormat"
          @change="onDateChange($event)"
        >
          <span class="cursor-pointer">{{
            date.format(config.dateFormat)
          }}</span>
        </a-date-picker>
      </h3>
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
          <tr v-for="(user, i) of users" :key="user._id" class="text-sm">
            <td>
              <NuxtLink :to="`/logs/${user.user_name}`">{{ user.short_name || user.name }}</NuxtLink>
            </td>
            <td class="text-center relative">
              <a-time-picker
                class="text-green-600"
                style="width: 100%"
                ref="entry"
                use12-hours
                :value="logs[user.user_name] && logs[user.user_name].entry"
                :format="config.timeFormat"
                @openChange="handleClose('entry', i)"
                @change="onTimeChange(user, 'entry', $event, i)"
              />
            </td>
            <td class="text-center relative">
              <a-time-picker
                class="text-red-600"
                style="width: 100%"
                use12-hours
                ref="exit"
                :value="logs[user.user_name] && logs[user.user_name].exit"
                :format="config.timeFormat"
                @change="onTimeChange(user, 'exit', $event, i)"
              />
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
      config: {
        timeout: null,
        dateFormat: 'DD-MMM-YYYY',
        timeFormat: 'h:mm a',
      },
      date: moment(),
      logs: {},
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

    disabledDate(current) {
      return (
        current > moment()
      );
    },

    handleClose(type, index) {
      return (open) => {
        console.log(type, index, open);
      };
    },

    onDateChange(moment) {
      this.date = moment;
      this.logs = {};
    },

    onTimeChange(user, type, moment, idx) {
      const picker = this.$refs[type][idx];

      clearTimeout(this.config.timeout);
      if (!moment) {
        delete this.logs[user.user_name][type];
        this.logs = { ...this.logs };
      } else {
        this.logs = {
          ...this.logs,
          [user.user_name]: {
            ...this.logs[user.user_name],
            [type]: moment,
          },
        };
      }

      this.config.timeout = setTimeout(() => {
        picker.$refs.timePicker.setOpen(false);
        this.update(user, type, moment);
      }, 3000);
    },

    getTimeLog(date) {
      this.$axios
        .get('/log/time', {
          params: {
            date: date.format(this.config.dateFormat),
          },
        })
        .then((res) => {
          res.data.forEach((log) => {
            this.logs[log.user_name] = {
              entry: log.entry ? moment(log.entry) : null,
              exit: log.exit ? moment(log.exit) : null,
              user_name: log.user_name,
            };
          });
          this.logs = { ...this.logs };
        })
        .catch((error) => {
          console.error(error);
        });
    },

    update(user, type, moment) {
      this.$axios
        .post('/log/time', {
          date: this.date,
          user_id: user._id,
          user_name: user.user_name,
          name: user.short_name,
          [type]: moment,
        })
        .then((res) => {
          this.$message[res.data.type](res.data.message);
        });
    },
  },
};
</script>
