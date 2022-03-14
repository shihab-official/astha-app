<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Calendar</h3>
    </div>
    <hr />
    <a-calendar
      :key="calendarKey"
      :header-render="headerRender"
      :valid-range="validRange"
      :disabled-date="disabledDate"
    >
      <ul slot="dateCellRender" slot-scope="value" class="events">
        <li v-for="item of getData(value)" :key="item.label" class="my-1">
          <div
            v-if="item.type === 'holiday'"
            class="leave text-right text-red-600"
          >
            {{ item.label }}
          </div>
          <NuxtLink v-else :to="`/logs/${item.id}`" class="block" :title="`${item.option === 0 ? '1st half - ' : (item.option === 1 ? '2nd half - ' : '')}${item.reason}`">
            <a-tag
              color="blue"
              :class="`pointer-events-none w-full relative option-${item.option}`"
              style="margin-right: 0"
            >
              <span class="relative">{{ item.label }}</span>
            </a-tag>
          </NuxtLink>
        </li>
      </ul>
    </a-calendar>
  </div>
</template>

<style>
.ant-fullcalendar-fullscreen .ant-select-selection--single {
  height: 35px;
}
.ant-fullcalendar-calendar-body {
  padding: 0;
}
.ant-fullcalendar-table tbody {
  border: solid 1px #e8e8e8 !important;
  border-width: 0 0 1px 1px !important;
}
.ant-fullcalendar-column-header {
  width: calc(100% / 7);
}
.ant-fullcalendar-cell {
  padding: 0;
}
.ant-fullcalendar-date {
  border: solid 1px #e8e8e8 !important;
  border-width: 1px 1px 0 0 !important;
  display: flex !important;
  flex-direction: column;
  padding: 0 !important;
  margin: 0 !important;
}
.ant-fullcalendar-fullscreen tr:hover:after,
.ant-fullcalendar-fullscreen .ant-fullcalendar-date:hover,
.ant-fullcalendar-fullscreen .ant-fullcalendar-today .ant-fullcalendar-date {
  background: unset;
}
.ant-fullcalendar-value {
  width: 100% !important;
  padding: 0 4px;
}
.ant-fullcalendar-today .ant-fullcalendar-value {
  font-weight: 500;
  color: #79c91c !important;
  display: flex;
  justify-content: space-between;
  text-shadow: 0 0 5px rgb(0 0 0 / 10%);
}
.ant-fullcalendar-today .ant-fullcalendar-value:before {
  content: 'Today';
}
.ant-fullcalendar-content {
  height: unset !important;
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
  background-color: rgb(255 0 0 / 5%);
  z-index: 0;
}
.ant-fullcalendar-fullscreen .ant-tag:before, .ant-fullcalendar-fullscreen .ant-tag:after {
  content: '';
    position: absolute;
    top: 1px;
    bottom: 1px;
    width: 50%;
    background-color: #fff;
    opacity: 0;
}

.ant-fullcalendar-fullscreen .ant-tag:before {
    left: 1px;
}

.ant-fullcalendar-fullscreen .ant-tag:after {
    right: 1px;
}

.ant-fullcalendar-fullscreen .ant-tag.option-1:before {
  opacity: 1;
}

.ant-fullcalendar-fullscreen .ant-tag.option-0:after {
  opacity: 1;
}
</style>

<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
</style>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'calendar',
  data() {
    return {
      calendarKey: 0,
    };
  },
  computed: {
    ...mapGetters('user', ['logs']),
    ...mapGetters('calendar', ['holidays', 'leaves']),
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
      return current.day() > 4;
    },
    getData: function (value) {
      const items = [];
      const date = value.format('DD-MMM-YYYY');
      const holiday = this.holidays.find(
        (holiday) => holiday.approved && holiday.date === date
      );

      if (holiday) {
        items.push({ type: 'holiday', label: holiday.title });
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
  },
};
</script>
