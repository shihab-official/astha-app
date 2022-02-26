<template>
  <div>
    <div class="header flex justify-between">
      <h1 class="m-0">Summary</h1>
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
    <div class="table-wrapper" ref="tableWrapper" v-if="users.length > 0">
      <table>
        <thead>
          <tr>
            <th class="position-sticky left-0 bg-orange-100"></th>
            <template v-for="date in datesInRange">
              <th
                :key="date.code"
                :ref="date.today ? 'today' : null"
                :class="`${date.today ? 'today' : ''} ${
                  date.weekend
                    ? 'weekend text-center text-gray-400 bg-gray-50'
                    : ''
                }`"
              >
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
            <td class="position-sticky left-0 bg-orange-50">
              <NuxtLink :to="`/${user.email}`">{{ user.name }}</NuxtLink>
            </td>
            <template v-for="date in datesInRange">
              <td
                :key="date.code"
                class="log-content"
                :class="`${date.formatted} ${
                  date.weekend
                    ? 'weekend text-center align-middle text-gray-400 bg-gray-50'
                    : ''
                } ${
                  user.log[date.code] && user.log[date.code].type === 'leave'
                    ? 'on-leave bg-red-100'
                    : ''
                }`"
              >
                <pre v-if="user.log[date.code]">{{
                  user.log[date.code].content || user.log[date.code].reason
                }}</pre>
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
  max-width: 400px;
}
.log-content {
  vertical-align: top;
}
td.weekend:before {
  content: 'Weekend';
  font-size: 75%;
  letter-spacing: 0.5px;
}
th.position-sticky {
  box-shadow: 0 -25px 8px #ddd, 0 10px 8px #ddd;
}
td.position-sticky {
  box-shadow: 0 10px 8px #ddd;
}
td pre {
  font-size: 0.8rem;
  white-space: break-spaces;
}
</style>

<script>
import moment from 'moment';
import { getDatesInRange } from '~/server-middleware/utilities/date';

export default {
  name: 'Work-Update',
  middleware({ redirect, $auth }) {
    if (!$auth.user.isAdmin) {
      return redirect(`/${$auth.user.email}`);
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
      return getDatesInRange(
        this.dateRange[0],
        this.dateRange[1],
        this.dateFormat
      );
    },
  },
  mounted: function () {
    document.title = 'Work Update';
    this.showLogs();
  },
  updated: function () {
    if (this.$refs?.today?.length > 0) {
      this.$refs.tableWrapper.scrollTo(this.$refs.today[0].offsetLeft - 200, 0);
    }
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
    showLogs: function () {
      this.$axios
        .get(`/api/user-logs`, {
          params: {
            range: this.datesInRange.map(function (date) {
              return date.code;
            })
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
