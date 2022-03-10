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
          <tr v-for="user in users" :key="user.id">
            <template v-if="user.show_log">
              <td class="sticky left-0 bg-orange-50">
                <NuxtLink :to="`/${user.id}`">{{ user.short_name || user.name }}</NuxtLink>
              </td>
              <template v-for="date in datesInRange">
                <user-log
                  :key="date.code"
                  :date="date"
                  :id="user.id"
                  :userLog="user.log"
                  :logs="logs"
                ></user-log>
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
table {
  font-size: 0.9rem;
}
th {
  font-size: 84%;
}
td {
  white-space: normal;
  min-height: 34px;
  padding: 0;
}
th.sticky {
  box-shadow: 0 -25px 8px #ddd, 0 10px 8px #ddd;
}
td.sticky {
  width: 120px;
  min-width: 120px;
  padding: 6px 10px;
  box-shadow: 0 10px 8px #ddd;
}
</style>

<script>
import moment from 'moment';
import { getDatesInRange } from '~/server-middleware/utilities/date';
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'Home',
  async asyncData({ redirect, $auth, $axios }) {
    await $axios
      .get(`/api/user`, {
        params: {
          id: $auth.user.id,
        },
      })
      .then((res) => {
        if (!res.data.user.admin && !res.data.user.management) {
          return redirect(`/${$auth.user.id}`)
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
      return getDatesInRange(
        this.dateRange[0],
        this.dateRange[1],
        this.dateFormat
      );
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
    ...mapActions('user', ['getUsersWithLogs']),
    disabledDate: function (current) {
      return current && current.day() > 4;
    },
    onChange: function (range) {
      this.dateRange = range;
      this.showLogs();
    },
    showLogs: function () {
      this.getUsersWithLogs(this.datesInRange);
    },
  },
};
</script>
