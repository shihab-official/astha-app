<template>
  <div v-if="log" class="log relative pre" :class="cssClasses[leave]">
    <template v-if="leave !== 2">
      <div v-if="log.work" class="work-log">{{log.work.detail}}</div>
      <div v-else class="work-log">&nbsp;</div>
    </template>
    <div v-if="log.leave" class="bg-red-50 text-red-600 leave-log" :title="leaveInfo[leave]">{{log.leave.detail}}</div>
  </div>
</template>

<style scoped>
  .log {
    font: 0.8rem/1.5 monospace;
    margin: 1px;
  }
  .log>div {
    width: 100%;
    padding: 5px 9px;
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
      return this.log.leave && this.log.leave.option;
      // const leaveOption = this.log.leave && this.log.leave.option;
      // return leaveOption === 0 ? 'flex flex-col-reverse' : (leaveOption === 1 ? 'flex flex-col' : (leaveOption === 2 ? 'leave' : ''));
    }
  }
};
</script>