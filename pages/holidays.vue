<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Holidays</h3>
      <div class="space-x-3">
        <span
          @click="setHolidays()"
          class="text-sm h-fit py-1 px-3 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white rounded cursor-pointer"
          > Update </span
        >
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
            :key="index"
            class="text-sm"
            :class="{ 'text-red-400': !holiday.approved }"
          >
            <td class="text-right">{{ ++index }}</td>
            <td>{{ holiday.title }}</td>
            <td class="text-center relative">
              <a-date-picker
                :value="holiday.moment"
                :format="dateFormat"
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Holidays',
  async asyncData({ redirect, $auth, $axios }) {
    await $axios
      .get(`/api/user`, {
        params: {
          id: $auth.user.id,
        },
      })
      .then((res) => {
        if (!res.data.user.admin && !res.data.user.management) {
          return redirect(`/`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  data() {
    return {
      dateFormat: 'DD-MMM-YYYY'
    };
  },
  computed: {
    ...mapGetters('calendar', ['holidays']),
  },
  mounted() {
    this.getHolidays();
  },
  methods: {
    ...mapActions('calendar', ['getHolidays', 'setHoliday', 'setHolidays']),
    onDateChange(holiday, moment) {
      delete holiday.moment;
      holiday.date = moment.format(this.dateFormat);
      this.setHoliday(holiday);
    },
    onApprovalChange(holiday, approved) {
      delete holiday.moment;
      holiday.approved = approved;
      this.setHoliday(holiday);
    }
  },
};
</script>
