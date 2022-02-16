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
            <template v-for="(i, day) in daysInRange">
              <th
                :key="day"
                :class="`${weekend(addDays(day)) ? 'weekend' : ''}`"
              >
                {{ addDays(day) }}
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
            <template v-for="(i, day) in daysInRange">
              <td
                :key="day"
                class="log-content"
                :class="`${addDays(day)} ${
                  weekend(addDays(day)) ? 'weekend' : ''
                }`"
              ></td>
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
  font-size: 84%;
  font-weight: 500;
  letter-spacing: 0.5px;
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
    daysInRange: function () {
      return this.dateRange[1].diff(this.dateRange[0], 'days') + 1;
    },
  },
  mounted: function () {
    document.title = 'Work Update';
    this.$axios
      .get(`/api/users`)
      .then((res) => {
        this.users = res.data.filter((user) => {
          if (!user.admin) {
            return user;
          }
        });
      })
      .catch((error) => {
        // console.error(error);
      });
  },
  methods: {
    moment,
    disabledDate: function (current) {
      return current && current.day() > 4;
    },
    addDays: function (n) {
      return this.dateRange[0].clone().add(n, 'day').format(this.dateFormat);
    },
    weekend: function (date) {
      return moment(date).day() > 4;
    },
    onChange: function (range) {
      this.dateRange = range;
    },
  },
};
</script>
