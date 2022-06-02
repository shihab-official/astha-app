<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Calendar</h3>
    </div>
    <hr />
    <a-modal
      title="Apply for leave"
      :visible="leaveFormVisible"
      :footer="false"
      @cancel="closeLeaveForm"
    >
      <leave-form v-if="leaveFormVisible" :start="leaveStart" @leaveApplied="leaveApplied"></leave-form>
    </a-modal>
    <a-calendar
      :key="calendarKey"
      :header-render="headerRender"
      :valid-range="validRange"
      :disabled-date="disabledDate"
      @select="onDateSelection"
    >
      <div slot="dateCellRender" slot-scope="value" class="events">
        <div v-for="item of getData(value)" :key="(item.title || item.name)" class="mb-0.5">
          <div
            v-if="item.type === 'holiday'"
            class="leave text-right text-green-600"
          >
            {{ item.title }}
          </div>
          <template v-else>
            <a-tag
              color="red"
              style="margin-right: 0"
              :style="{cursor: ($auth.user.admin || $auth.user.manager ? 'pointer' : '')}"
              @click="userLog($event, item.user_name)"
              :class="`w-full relative ${item.option === 0 ? 'option-0 text-right' : item.option === 1 ? 'option-1 text-left' : 'text-center'}`"
              :title="`${item.option === 0 ? '1st half - ' : item.option === 1 ? '2nd half - ' : ''}`"
            >
              <span class="relative z-10">{{ item.name }}</span>
            </a-tag>
          </template>
        </div>
      </div>
    </a-calendar>
  </div>
</template>

<style scoped>
.ant-fullcalendar-fullscreen >>> .ant-select-selection--single {
  height: 35px;
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-calendar-body {
  padding: 0;
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-table tbody {
  border: solid 1px #e8e8e8;
  border-width: 0 0 1px 1px;
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-column-header {
  width: calc(100% / 7);
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-cell {
  padding: 0;
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-disabled-cell {
  background-color: #fbfbfb;
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-date {
  border: solid 1px #e8e8e8;
  border-width: 1px 1px 0 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  cursor: default;
}
.ant-fullcalendar-fullscreen >>> tr:hover:after,
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-date:hover,
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-today .ant-fullcalendar-date,
.ant-fullcalendar-fullscreen
  >>> .ant-fullcalendar-selected-day
  .ant-fullcalendar-date {
  background: unset;
}
.ant-fullcalendar-fullscreen
  >>> .ant-fullcalendar-selected-day
  .ant-fullcalendar-value {
  color: unset;
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-value {
  width: 100%;
  padding: 0 4px;
  cursor: default;
}
.ant-fullcalendar-fullscreen
  >>> .ant-fullcalendar-today
  .ant-fullcalendar-value {
  font-weight: 500;
  color: #1890ff;
  display: flex;
  justify-content: space-between;
  text-shadow: 0 0 5px rgb(0 0 0 / 10%);
}
.ant-fullcalendar-fullscreen
  >>> .ant-fullcalendar-today
  .ant-fullcalendar-value:before {
  content: 'Today';
}
.ant-fullcalendar-fullscreen >>> .ant-fullcalendar-content {
  flex-grow: 1;
  padding: 4px 6px;
  bottom: 0;
}
.ant-fullcalendar-fullscreen .leave:before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgb(0 255 0 / 5%);
  z-index: 0;
}
.ant-fullcalendar-fullscreen .ant-tag:before,
.ant-fullcalendar-fullscreen .ant-tag:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background-color: #fff;
  opacity: 0;
}

.ant-fullcalendar-fullscreen .ant-tag:before {
  border-right: solid 1px #ffd4d4;
  left: 0;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.ant-fullcalendar-fullscreen .ant-tag:after {
  border-left: solid 1px #ffd4d4;
  right: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
}

.ant-fullcalendar-fullscreen .ant-tag.option-0:after,
.ant-fullcalendar-fullscreen .ant-tag.option-1:before {
  opacity: 1;
}
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      leaveStart: null,
      leaveFormVisible: false,
      calendarKey: 0,
    };
  },
  mounted: function () {
    document.title = 'Calendar';
  },
  computed: {
    ...mapGetters('calendar', ['holidays', 'leaves']),
    approvedHolidays: function () {
      return this.holidays
        .filter((holiday) => holiday.approved)
        .map((holiday) => holiday.date);
    },
    validRange: function () {
      return [moment().startOf('year'), moment().endOf('year')];
    },
  },
  watch: {
    holidays: function () {
      this.calendarKey++;
    },
  },
  methods: {
    disabledDate(current) {
      return (
        current.day() > 4 ||
        this.approvedHolidays.includes(current.format('DD-MMM-YYYY'))
      );
    },

    getData(value) {
      const items = [];
      const date = value.format('DD-MMM-YYYY');
      const holiday = this.holidays.find(
        (holiday) => holiday.approved && holiday.date === date
      );

      if (holiday) {
        items.push({ type: 'holiday', title: holiday.title });
      }

      if (this.leaves[date]?.length > 0) {
        items.push(...this.leaves[date]);
      }

      return items;
    },

    headerRender({ value, onChange }) {
      const months = value.localeData().months();
      const monthOptions = [];

      for (let i = 0; i < months.length; i++) {
        monthOptions.push(
          <a-select-option class="month-item" key={`${i}`} value={i}>
            {months[i]}
          </a-select-option>
        );
      }
      const monthIndex = value.month();

      return (
        <div style={{ padding: '10px' }}>
          <div class="flex justify-between">
            <span
              class={`text-sm font-medium flex justify-center items-center rounded border border-solid w-20 ${
                monthIndex > 0
                  ? 'text-gray-400 hover:text-sky-500 cursor-pointer'
                  : 'text-gray-200 cursor-default'
              }`}
              onClick={() => {
                if (monthIndex > 0) {
                  const newValue = value.clone();
                  newValue.month(monthIndex - 1);
                  onChange(newValue);
                }
              }}
            >
              Previous
            </span>
            <div style="font-size: 16px; font-weight: 500;">
              <a-select
                style="font: inherit; width: 165px; margin-right: 10px;"
                dropdownMatchSelectWidth={false}
                option-label-prop="label"
                value={`${months[monthIndex]}, ${value.year()}`}
                onChange={(selectedMonth) => {
                  const newValue = value.clone();
                  newValue.month(selectedMonth);
                  onChange(newValue);
                }}
              >
                {monthOptions}
              </a-select>
            </div>
            <span
              class={`text-sm font-medium flex justify-center items-center rounded border border-solid w-20 ${
                monthIndex < 11
                  ? 'text-gray-400 hover:text-sky-500 cursor-pointer'
                  : 'text-gray-200 cursor-default'
              }`}
              onClick={() => {
                if (monthIndex < 11) {
                  const newValue = value.clone();
                  newValue.month(monthIndex + 1);
                  onChange(newValue);
                }
              }}
            >
              Next
            </span>
          </div>
        </div>
      );
    },

    userLog(event, user_name) {
      event.stopPropagation();
      if (this.$auth.user.admin || this.$auth.user.manager) {
        this.$router.push(`/logs/${user_name}`);
      }
    },

    onDateSelection(date) {
      this.leaveStart = date;
      this.leaveFormVisible = true;
    },

    leaveApplied() {
      this.calendarKey++;
      this.leaveFormVisible = false;
    },

    closeLeaveForm() {
      this.leaveFormVisible = false;
    },
  },
};
</script>
