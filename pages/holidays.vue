<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Holidays of {{currentYear}}</h3>
      <div class="space-x-3">
        <a-button type="primary" @click="updateHolidays()" style="height: 28px;"> Update </a-button>

        <!-- <span
          class="text-sm h-fit py-1 px-3 bg-sky-600 text-white hover:bg-sky-700 hover:text-white rounded cursor-pointer"
          >Add</span
        > -->
      </div>
    </div>
    <hr />
    <div class="table-wrapper" v-if="holidays && holidays.length > 0">
      <table>
        <thead>
          <tr>
            <th class="w-1"></th>
            <th>Title</th>
            <th class="w-1/5 text-center">Date</th>
            <th class="w-1/5 text-center">Approved</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(holiday, index) of holidays"
            :key="holiday._id"
            class="text-sm"
            :class="{ 'text-red-400': !holiday.approved }"
          >
            <td class="text-right">{{ ++index }}</td>
            <td>{{ holiday.title }}</td>
            <td class="text-center relative">
              <a-date-picker
                :value="holiday.moment"
                :format="dateFormat"
                :disabled-date="disabledDate"
                @change="onDateChange(holiday, $event)"
              >
                <span class="cursor-pointer">{{ holiday.date }}</span>
              </a-date-picker>
            </td>
            <td class="text-center">
              <a-switch
                :default-checked="holiday.approved"
                checked-children=" Yes "
                un-checked-children=" No "
                @change="onApprovalChange(holiday, $event)"
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
</style>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Holidays',
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
    };
  },
  computed: {
    ...mapGetters('calendar', ['holidays']),
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    ...mapActions('calendar', ['setHoliday', 'updateHolidays']),

    disabledDate(current) {
      return (
        current < moment().startOf('year') || current > moment().endOf('year')
      );
    },

    onDateChange(holiday, moment) {
      delete holiday.moment;
      holiday.date = moment.format(this.dateFormat);
      this.setHoliday(holiday);
    },

    onApprovalChange(holiday, approved) {
      delete holiday.moment;
      holiday.approved = approved;
      this.setHoliday(holiday);
    },
  },
};
</script>
