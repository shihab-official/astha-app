<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">
        Time Log ~
        <a-date-picker
          style="
            font-size: inherit;
            color: rgb(0 0 0 / 65%);
            padding: 0 8px;
            box-shadow: 0 0 1px 1px #d9d9d9 inset;
            border-radius: 4px;
            background-color: rgb(0 0 0 / 2%);
          "
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
      <a-button type="primary" @click="exportTimeLog()" style="height: 28px">
        Export
      </a-button>
    </div>
    <hr />
    <div class="table-wrapper" v-if="users && users.length > 0">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th class="w-1/5 text-center">Entry</th>
            <th class="w-1/5 text-center">Exit</th>
            <th class="w-1/5 text-center">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) of users" :key="user._id" class="text-sm">
            <td>
              <NuxtLink :to="`/logs/${user.user_name}`">{{
                user.short_name || user.name
              }}</NuxtLink>
            </td>
            <td class="text-center relative">
              <a-time-picker
                class="entry"
                style="width: 100%"
                ref="entry"
                use12-hours
                :value="logs[user.user_name] && logs[user.user_name].entry"
                :format="config.timeFormat"
                :open="config.entry[i]"
                @openChange="handleClose(user, 'entry', i, $event)"
                @change="onTimeChange(user, 'entry', $event)"
              >
                <a-button
                  slot="addon"
                  size="small"
                  type="primary"
                  @click="handleClose(user, 'entry', i, false)"
                >
                  Ok
                </a-button>
              </a-time-picker>
            </td>
            <td class="text-center relative">
              <a-time-picker
                class="exit"
                style="width: 100%"
                use12-hours
                ref="exit"
                :value="logs[user.user_name] && logs[user.user_name].exit"
                :format="config.timeFormat"
                :open="config.exit[i]"
                @openChange="handleClose(user, 'exit', i, $event)"
                @change="onTimeChange(user, 'exit', $event)"
              >
                <a-button
                  slot="addon"
                  size="small"
                  type="primary"
                  @click="handleClose(user, 'exit', i, false)"
                >
                  Ok
                </a-button>
              </a-time-picker>
            </td>
            <td class="text-center font-bold">
              {{ logs[user.user_name] && logs[user.user_name].duration }}
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
.ant-time-picker.entry {
  color: #16a34a;
}
.ant-time-picker.exit {
  color: #dc2626;
}
.ant-time-picker >>> input {
  font-weight: 600;
  color: inherit;
  text-align: center;
  background-color: transparent;
  border: 0;
}
.ant-time-picker >>> .ant-time-picker-icon {
  display: none;
}
</style>

<script>
import { generateXLSX } from '~/helpers/xlsx-helper';
import { saveFile } from '~/helpers/file-helper';
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
        dateFormat: 'DD-MMM-YYYY',
        timeFormat: 'h:mm a',
        entry: [],
        exit: [],
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
    users: function () {
      const l = this.users.length;
      this.config.entry = Array(l).fill(false);
      this.config.exit = Array(l).fill(false);
    },
  },
  mounted: function () {
    document.title = 'Time Log';
    this.getTimeLog(this.date);
    window['config'] = this.config;
  },
  methods: {
    moment,

    disabledDate(current) {
      return current > moment();
    },

    handleClose(user, type, index, open) {
      this.config[type][index] = open;
      this.config[type] = [...this.config[type]];
      if (!open) {
        const moment = this.$refs[type][index].value;
        if (moment) {
          this.update(user, type, moment);
        }
      }
    },

    onTimeChange(user, type, moment) {
      if (!moment) {
        delete this.logs[user.user_name][type];
        this.logs = { ...this.logs };
        this.update(user, type, moment);
      } else {
        this.logs = {
          ...this.logs,
          [user.user_name]: {
            ...this.logs[user.user_name],
            [type]: moment,
          },
        };
      }
    },

    onDateChange(moment) {
      this.date = moment;
      this.logs = {};
    },

    getTimeLog(date) {
      this.$axios
        .get('log/time', {
          params: {
            date: moment(date.format(this.config.dateFormat)).toDate(),
          },
        })
        .then((res) => {
          res.data.forEach((log) => {
            this.logs[log.user_name] = {
              entry: log.entry ? moment(log.entry) : null,
              exit: log.exit ? moment(log.exit) : null,
              duration:
                log.entry && log.exit
                  ? moment
                      .utc(moment(log.exit).diff(moment(log.entry)))
                      .format('h:mm')
                  : '',
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
        .post('log/time', {
          date: this.date.format(this.config.dateFormat),
          user_id: user._id,
          user_name: user.user_name,
          name: user.short_name,
          [type]: moment,
        })
        .then((res) => {
          this.$message[res.data.type](res.data.message);
        });
    },

    exportTimeLog() {
      this.$axios
        .get('export/time-log', {
          params: { date: this.date.startOf('day').toDate() },
        })
        .then((res) => {
          if (res.status === 200) {
            const blob = new Blob([generateXLSX(res.data)], {
              type: 'application/octet-stream',
            });
            saveFile(blob, `${this.date.format(this.config.dateFormat)}.xlsx`);
          }
        });
    },
  },
};
</script>
