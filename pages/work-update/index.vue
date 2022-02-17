<template>
  <div>
    <div class="header flex justify-between">
      <h1 class="m-0">Work log</h1>
      <a-range-picker
        class="range-picker"
        :disabled-date="disabledDate"
        :allowClear="false"
        :value="dateRange"
        :format="dateFormat"
        @change="onChange"
      />
    </div>
    <hr />
    <div class="table-wrapper" v-if="users.length > 0">
      <table>
        <thead>
          <tr>
            <th class="position-sticky left-0"></th>
            <template v-for="date in datesInRange">
              <th :key="date.code" :class="`${date.weekend ? 'weekend' : ''}`">
                {{ date.formatted }}
                <a-tag
                  v-if="date.today && !date.weekend"
                  color="blue"
                  style="font-size: 11px; margin-left: 8px"
                >
                  Today
                </a-tag>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td class="position-sticky left-0">
              <NuxtLink :to="`/work-update/${user.email}`">{{
                user.name
              }}</NuxtLink>
            </td>
            <template v-for="date in datesInRange">
              <td
                :key="date.code"
                class="log-content"
                :class="`${date.formatted} ${date.weekend ? 'weekend' : ''}`"
              >
                <pre>{{ user.log[date.code] }}</pre>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else><a-empty /></div>
  </div>
</template>

<style scoped>
.ant-calendar-disabled-cell {
  opacity: 0.6;
  background-color: #f5f5f5;
}
.range-picker {
  width: 245px;
}
table {
  font-size: 0.9rem;
}
th {
  font-size: 84%;
}
td:first-child {
  min-width: 200px;
  max-width: 200px;
}
td {
  white-space: normal;
}
.log-content:not(.weekend) {
  min-width: 400px;
}
.weekend {
  color: #a7a7a7;
  text-align: center;
  background-color: #f5f5f5;
  vertical-align: middle;
}
td.weekend:before {
  content: 'Weekend';
  font-size: 75%;
  letter-spacing: 0.5px;
}
td pre {
  font-size: 0.8rem;
  margin: 0;
}
</style>

<script>
import moment from 'moment';

export default {
  name: 'Work-Update',
  middleware({ redirect, $auth }) {
    if (!$auth.user.isAdmin) {
      return redirect(`/work-update/${$auth.user.email}`);
    }
  },
  data() {
    return {
      users: [],
      logs: [],
      dateRange: [
        moment().startOf('week'),
        moment().startOf('week').add(4, 'day'),
      ],
    };
  },
  computed: {
    dateFormat: function () {
      return 'DD-MMM-YYYY';
    },
    datesInRange: function () {
      const dates = [],
        diff = this.dateRange[1].diff(this.dateRange[0], 'days');

      for (let n = 0; n <= diff; n++) {
        const date =
          n === 0
            ? this.dateRange[0]
            : n === diff
            ? this.dateRange[1]
            : this.dateRange[0].clone().add(n, 'day');
        dates.push({
          moment: date,
          formatted: date.format(this.dateFormat),
          code: date.format('YYYYMMDD'),
          today: moment().isSame(date, 'day'),
          weekend: date.day() > 4,
        });
      }
      return dates;
    },
  },
  mounted: function () {
    document.title = 'Work Update';
    this.showLogs();
  },
  directives: {
    nl2br: {
      inserted(el) {
        el.innerHTML = el.textContent.replace(/(?:\r\n|\r|\n)/g, '<br />');
      },
    },
  },
  methods: {
    moment,
    disabledDate: function (current) {
      return current && current.day() > 4;
    },
    onChange: function (range) {
      this.dateRange = range;
      this.showLogs();
    },
    // getUsers: function() {
    //   this.$axios
    //   .get(`/api/users`)
    //   .then((res) => {
    //     this.users = res.data.filter((user) => {
    //       if (!user.admin) {
    //         return user;
    //       }
    //     });
    //   })
    //   .catch((error) => {
    //     // console.error(error);
    //   });
    // },
    showLogs: function () {
      this.$axios
        .get(`/api/logs`, {
          params: {
            range: this.datesInRange.map(function (date) {
              return date.code;
            }),
          },
        })
        .then((res) => {
          this.users = res.data.filter((user) => {
            if (!user.admin) {
              return user;
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
