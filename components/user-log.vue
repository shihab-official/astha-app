<template>
  <div class="log relative text-xs" :class="[cssClasses[leave], {empty: emptyCell}]">
    <span v-if="emptyCell" class="text-lg">{{date}}</span>
    <template v-else>
      <template v-if="leave !== 2">
        <div v-if="log.work" class="work-log" v-html="log.work.detail"></div>
        <div v-else class="work-log">&nbsp;</div>
      </template>
      <div v-if="log.leave" class="bg-red-50 text-red-600 leave-log" :title="leaveInfo[leave]" v-html="log.leave.detail"></div>
    </template>
  </div>
</template>

<style scoped>
  .log {
    margin: 1px;
  }
  .log>div {
    width: 100%;
    padding: 5px 8px 0;
  }
  .log >>> p,
  .log >>> ul,
  .log >>> ol {
    margin-bottom: 7px;
  }
  .leave {
    margin: 0;
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 1px;
    left: 1px;
  }
  .leave .leave-log {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .leave-log {
    box-shadow: 0 0 0 1px #ff9b9b inset;
  }
  .empty {
    font-weight: 600;
    color: #eb4848;
    text-shadow: 3px 3px 6px #9d9d9d;
    background-color: #fffae9;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 0 1px #f1d470 inset;
  }
</style>

<script>
export default {
  props: ['date', 'id', 'log', 'logs'],
  data() {
    return {
      cssClasses: ['flex flex-col-reverse', 'flex flex-col', 'leave'],
      leaveInfo: ['1st half', '2nd half', 'Full day']
    }
  },
  computed: {
    leave: function() {
      return this.log?.leave && this.log?.leave.option;
    },
    emptyCell: function() {
      return !this.log?.work?.detail && !this.log?.leave?.detail;
    }
  }
};
</script>