<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Summary</h3>
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
            <th
              class="text-center sticky left-0 bg-orange-100 p-0 cursor-pointer"
              @click="showLogs()"
            >
              <span
                style="color: rgba(0, 0, 0, 0.85); font-size: 18px"
                :class="!loading ? 'spin' : ''"
                >&#11118;</span
              >
            </th>
            <template v-for="date of datesInRange">
              <th
                :key="date.code"
                :ref="date.today ? 'today' : null"
                :class="`text-center ${date.today ? 'today' : ''} ${
                  date.weekend
                    ? 'weekend text-gray-400 bg-gray-50'
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
          <tr v-for="user of users" :key="user.user_name">
            <template v-if="user.show_log">
              <td class="sticky left-0 bg-orange-50">
                <NuxtLink :to="`/logs/${user.user_name}`">{{ user.short_name || user.name }}</NuxtLink>
              </td>
              <template v-for="date of datesInRange">
                <td :key="date.code" :class="`${date.weekend ? 'weekend text-gray-400 bg-gray-50' : '' }`">
                  <div v-html="logs[`${user.user_name}_${date.code}`]"></div>
                </td>
              </template>
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
td {
  white-space: normal;
  min-height: 34px;
}
td.sticky {
  width: 120px;
  min-width: 120px;
}
</style>

<script>
import moment from 'moment';
import { getDatesInRange } from '~/server-middleware/utilities/date';
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'Logs',
  async asyncData({ redirect, $auth, $axios }) {
    await $axios
      .get(`/user/${$auth.user.user_name}`)
      .then((res) => {
        if (!res.data.user.admin && !res.data.user.management) {
          return redirect(`/logs/${$auth.user.user_name}`)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  data() {
    return {
      dateRange: [moment().startOf('week'), moment().endOf('week')],
    };
  },
  computed: {
    ...mapGetters('user', ['loading', 'users', 'logs']),
    dateFormat: function () {
      return 'DD-MMM-YYYY';
    },
    datesInRange: function () {
      return getDatesInRange({
        start: this.dateRange[0],
        end: this.dateRange[1],
        format: this.dateFormat
      });
    },
  },
  mounted: function () {
    document.title = 'Work Update';
  },
  updated: function () {
    if (this.$refs?.today?.length > 0) {
      this.$refs.tableWrapper.scrollTo(this.$refs.today[0].offsetLeft - 120, 0);
    }
  },
  methods: {
    moment,
    ...mapActions('user', ['getLogsByDate']),
    disabledDate: function (current) {
      return current && current.day() > 4;
    },
    onChange: function (range) {
      this.dateRange = range;
      this.showLogs();
    },
    showLogs: function () {
      this.getLogsByDate(this.dateRange);
    },
  },
};
</script>
