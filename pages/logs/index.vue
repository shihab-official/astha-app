<template>
  <div>
    <div class="flex items-center">
      <h3 class="m-0">Summary</h3>
      <!-- <a-input
        @change="search"
        @keyup="search"
        placeholder="Search"
        :allowClear="true"
      /> -->
      <div class="week-picker ant-input relative" style="margin-left: 10px; margin-right: auto;">
        <div class="flex justify-between">
          <span>{{dateRange[0].format(dateFormat)}}</span>
          <strong>&#129042;</strong>
          <span>{{dateRange[1].format(dateFormat)}}</span>
        </div>
        <a-week-picker
          class="opacity-0"
          style="position: absolute; left: -1px; top: -1px; right: -1px; bottom: -1px;"
          :disabled-date="disabledDate"
          :allowClear="false"
          :value="date"
          :format="dateFormat"
          @change="onChange"
        />
      </div>
      <a-input
        style="width: 150px;"
        @change="search"
        @keyup="search"
        placeholder="Search by name"
        :allowClear="true"
      />
    </div>
    <hr />
    <div class="table-wrapper" ref="tableWrapper" v-if="users.length > 0">
      <table class="hover">
        <thead>
          <tr>
            <th
              style="min-width: 100px;"
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
          <template v-for="user of users">
            <template v-if="user.show_log">
              <tr :key="user.user_name">
                <td class="sticky left-0 bg-orange-50">
                  <NuxtLink v-highlight="key" :to="`/logs/${user.user_name}`">{{ user.short_name || user.name }}</NuxtLink>
                </td>
                <template v-for="date of datesInRange">
                  <td :key="date.code" :class="`relative ${date.today ? 'today' : ''} ${date.weekend ? 'weekend text-gray-400 bg-gray-50' : '' }`">
                    <user-log :date="date.formatted" :log="logs[`${user.user_name}_${date.code}`]"></user-log>
                  </td>
                </template>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else><a-empty /></div>
  </div>
</template>

<style scoped>
td {
  vertical-align: top;
  min-height: 34px;
  padding: 0;
}
td:not(:first-child, .weekend) {
  min-width: 400px;
}
.weekend {
  min-width: 93px;
}
.today .empty,
.today ~ td .empty, 
.weekend .empty {
  display: none;
}
</style>

<script>
import moment from 'moment';
import { getDatesInRange } from '~/helpers/date-helper';
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'Logs',
  async asyncData({ redirect, $auth, $axios }) {
    await $axios
      .get(`user/${$auth.user.user_name}`)
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
      date: moment(),
      key: '',
    };
  },
  watch: {
    key: function (newKey, oldKey) {
      this.findUsers(newKey);
    },
  },
  computed: {
    ...mapGetters('user', ['loading', 'users', 'logs']),
    dateFormat: function () {
      return 'DD-MMM-YYYY';
    },
    dateRange: function() {
      return [this.date.clone().startOf('week'), this.date.clone().endOf('week')];
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
    this.scrollToToday();
  },
  updated: function () {
    this.scrollToToday();
  },
  methods: {
    moment,
    ...mapActions('user', ['findUsers', 'getLogsByDate']),
    search(e) {
      this.key = e.target.value;
    },
    disabledDate: function (current) {
      return current && current.day() > 4;
    },
    scrollToToday() {
      if (this.$refs.tableWrapper) {
        if (this.$refs.today?.length > 0) {
          this.$refs.tableWrapper.scrollTo(this.$refs.today[0].offsetLeft - 100, 0);
        } else {
          this.$refs.tableWrapper.scrollTo(2000, 0);
        }
      }
    },
    onChange: function (date) {
      this.date = date;
      this.showLogs();
    },
    showLogs: function () {
      this.getLogsByDate(this.dateRange);
    },
  },
  directives: {
    highlight: {
      componentUpdated: (el, { value }) => {
        const regex = new RegExp(value, 'gi');
        const response = el.innerText.replace(regex, function (str) {
          return !str ? str : `<span class="search-highlight">${str}</span>`;
        });
        el.innerHTML = response;
      },
    },
  },
};
</script>
