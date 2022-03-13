<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Calendar</h3>
    </div>
    <hr />
    <a-calendar>
      <ul slot="dateCellRender" slot-scope="value" class="events">
        <li v-for="item in getListData(value)" :key="item.content">
          <a-badge :status="item.type" :text="item.content" />
        </li>
      </ul>
    </a-calendar>
  </div>
</template>

<style>
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
.ant-fullcalendar-value {
  width: 100% !important;
  padding: 0 4px;
}
.ant-fullcalendar-content {
  height: unset !important;
  padding: 4px 6px;
  bottom: 0;
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
import { mapGetters } from 'vuex';

export default {
  name: 'calendar',
  computed: {
    ...mapGetters('user', ['logs']),
    ...mapGetters('holiday', ['holidays']),
  },
  methods: {
    getListData(value) {
      let listData;
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
          ];
          break;
        case 10:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
            { type: 'error', content: 'This is error event.' },
          ];
          break;
        case 15:
          listData = [
            { type: 'warning', content: 'This is warning event' },
            {
              type: 'success',
              content: 'This is very long usual event。。....',
            },
            { type: 'error', content: 'This is error event 1.' },
            { type: 'error', content: 'This is error event 2.' },
            { type: 'error', content: 'This is error event 3.' },
            { type: 'error', content: 'This is error event 4.' },
          ];
          break;
        default:
      }
      return listData || [];
    }
  }
};
</script>
