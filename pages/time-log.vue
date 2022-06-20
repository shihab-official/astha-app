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
            <th class="w-1 text-center">Late</th>
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
            <template v-if="logs[user.user_name] && logs[user.user_name].leave">
              <td
                class="text-center relative font-bold bg-red-50 text-red-500"
                style="height: 45px"
                colspan="100%"
              >
                On leave
              </td>
            </template>
            <template v-else>
              <td class="text-center">
                <a-switch
                  :checked="logs[user.user_name] && logs[user.user_name].late"
                  checked-children=" Yes "
                  un-checked-children=" No "
                  @change="onLateEntryChange(user, $event)"
                />
              </td>
              <td class="text-center relative">
                <form @keyup.enter="handleClose(user, 'entry', false)">
                  <a-time-picker
                    class="entry"
                    style="width: 100%"
                    :ref="`entry_${user.user_name}`"
                    use12-hours
                    :value="logs[user.user_name] && logs[user.user_name].entry"
                    :format="config.timeFormat"
                    :open="config.entry[user.user_name]"
                    :getPopupContainer="parentContainer"
                    @openChange="handleClose(user, 'entry', $event)"
                    @change="onTimeChange(user, 'entry', $event)"
                  >
                    <a-button
                      slot="addon"
                      size="small"
                      type="primary"
                      @click="handleClose(user, 'entry', false)"
                    >
                      Ok
                    </a-button>
                  </a-time-picker>
                </form>
              </td>
              <td class="text-center relative">
                <form @keyup.enter="handleClose(user, 'exit', false)">
                  <a-time-picker
                    class="exit"
                    style="width: 100%"
                    use12-hours
                    :ref="`exit_${user.user_name}`"
                    :value="logs[user.user_name] && logs[user.user_name].exit"
                    :format="config.timeFormat"
                    :open="config.exit[user.user_name]"
                    :getPopupContainer="parentContainer"
                    @openChange="handleClose(user, 'exit', $event)"
                    @change="onTimeChange(user, 'exit', $event)"
                  >
                    <a-button
                      slot="addon"
                      size="small"
                      type="primary"
                      @click="handleClose(user, 'exit', false)"
                    >
                      Ok
                    </a-button>
                  </a-time-picker>
                </form>
              </td>
              <td class="text-center font-bold">
                {{ logs[user.user_name] && logs[user.user_name].duration }}
              </td>
            </template>
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
import { startOfDay } from '~/helpers/date-helper';
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
        entry: {},
        exit: {},
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
      const timePickers = {};
      this.users.forEach((user) => {
        timePickers[user.user_name] = false;
      });
      this.config.entry = timePickers;
      this.config.exit = timePickers;
    },
  },
  mounted: function () {
    document.title = 'Time Log';
    this.getTimeLog(this.date);
  },
  methods: {
    moment,

    disabledDate(current) {
      return current > moment();
    },

    parentContainer(triggerNode) {
      return triggerNode.parentNode;
    },

    handleClose(user, type, open) {
      this.config[type] = {...this.config[type], [user.user_name]: open};
      // this.config[type][user.user_name] = open;
      // this.config[type] = {...this.config[type]};
      if (!open) {
        const moment = this.$refs[`${type}_${user.user_name}`][0].value;
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

    onLateEntryChange(user, late) {
      this.logs = {
        ...this.logs,
        [user.user_name]: {
          ...this.logs[user.user_name],
          late,
        },
      };

      this.submit({
        date: startOfDay(this.date),
        user_id: user._id,
        user_name: user.user_name,
        name: user.short_name,
        late,
      });
    },

    duration(start, end) {
      return !start || !end
        ? ''
        : moment.utc(moment(end).diff(moment(start))).format('h:mm');
    },

    getTimeLog(date) {
      this.$axios
        .get('log/time', {
          params: {
            date: startOfDay(date),
          },
        })
        .then((res) => {
          res.data.forEach((log) => {
            this.logs[log.user_name] = {
              late: log.late || false,
              leave: log.leave?.option === 2,
              entry: log.entry ? moment(log.entry) : null,
              exit: log.exit ? moment(log.exit) : null,
              duration: this.duration(log.entry, log.exit),
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
      const log = this.logs[user.user_name];
      log.duration = this.duration(log.entry, log.exit);

      this.submit({
        date: startOfDay(this.date),
        user_id: user._id,
        user_name: user.user_name,
        name: user.short_name,
        late: log.late || false,
        [type]: moment
          ? new Date(
              `${this.date.format(this.config.dateFormat)} ${moment.format(
                'h:mm:ss a'
              )}`
            )
          : null,
      });
    },

    submit(payload) {
      this.$axios.post('log/time', payload).then((res) => {
        this.$message[res.data.type](res.data.message);
      });
    },

    exportTimeLog() {
      this.$axios
        .get('export/time-log', {
          params: {
            date: startOfDay(this.date),
          },
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
